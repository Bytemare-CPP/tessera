import os
import torch
import uvicorn
from PIL import Image
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from transformers import CLIPProcessor, CLIPModel
import logging
import numpy as np
from supabase import create_client, Client
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("vibe-matcher")

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = None

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
    logger.info("Supabase client initialized")
else:
    logger.warning("Supabase credentials missing, operating in standalone mode")

# Initialize FastAPI app
app = FastAPI(title="Vibe Matcher Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your allowed origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and processor
model = None
processor = None

# Helper functions from your original script
def load_image_from_bytes(image_bytes):
    return Image.open(BytesIO(image_bytes)).convert("RGB")

def get_embedding(image, processor, model):
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        embedding = model.get_image_features(**inputs)
    return embedding[0]

def cosine_similarity(vec1, vec2):
    vec1 = vec1 / vec1.norm()
    vec2 = vec2 / vec2.norm()
    return torch.dot(vec1, vec2).item()

# Load model at startup
@app.on_event("startup")
async def startup_event():
    global model, processor
    logger.info("Loading CLIP model...")
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    logger.info("CLIP model loaded successfully")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

# Simple endpoint to compare two images
@app.post("/compare")
async def compare_images(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...),
    threshold: float = Form(0.90)
):
    try:
        # Read image files
        image1_bytes = await image1.read()
        image2_bytes = await image2.read()
        
        # Load images
        pil_image1 = load_image_from_bytes(image1_bytes)
        pil_image2 = load_image_from_bytes(image2_bytes)
        
        # Generate embeddings
        embedding1 = get_embedding(pil_image1, processor, model)
        embedding2 = get_embedding(pil_image2, processor, model)
        
        # Calculate similarity
        score = cosine_similarity(embedding1, embedding2)
        
        # Determine if it's a match
        is_match = score > threshold
        
        return {
            "similarity_score": score,
            "is_match": is_match,
            "threshold": threshold
        }
    except Exception as e:
        logger.error(f"Error comparing images: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing images: {str(e)}")

# Endpoint to process a single selfie and store embedding
@app.post("/process-selfie")
async def process_selfie(
    selfie: UploadFile = File(...),
    user_id: str = Form(...)
):
    try:
        # Read image file
        selfie_bytes = await selfie.read()
        
        # Load image
        pil_image = load_image_from_bytes(selfie_bytes)
        
        # Generate embedding
        embedding = get_embedding(pil_image, processor, model)
        
        # Convert to list for storage
        embedding_list = embedding.cpu().numpy().tolist()
        
        # Check if we have Supabase connection
        if supabase:
            # Store the embedding in Supabase
            selfie_data = {
                "user_id": user_id,
                "embedding": embedding_list,
                "status": "pending"
            }
            
            result = supabase.table("selfie_candidates").insert(selfie_data).execute()
            
            # Find potential matches
            five_minutes_ago = (datetime.utcnow() - timedelta(minutes=5)).isoformat()
            
            # Query recent selfie candidates from other users
            response = supabase.table("selfie_candidates") \
                .select("id,user_id,embedding") \
                .neq("user_id", user_id) \
                .eq("status", "pending") \
                .gt("created_at", five_minutes_ago) \
                .execute()
                
            candidates = response.data
            best_match = None
            best_score = 0.9  # Minimum threshold
            
            # Compare with other recent selfies
            for candidate in candidates:
                candidate_embedding = torch.tensor(candidate["embedding"])
                similarity = cosine_similarity(embedding, candidate_embedding)
                
                if similarity > best_score:
                    best_score = similarity
                    best_match = candidate
            
            # If we found a match
            if best_match:
                # Return match info to the backend
                return {
                    "match_found": True,
                    "matched_user_id": best_match["user_id"],
                    "similarity_score": float(best_score)
                }
            
            # No match found
            return {
                "match_found": False,
                "user_id": user_id,
                "message": "Selfie processed and stored. No matches found."
            }
        else:
            # No Supabase, just return the embedding info
            return {
                "user_id": user_id,
                "embedding_shape": len(embedding_list),
                "processed": True,
                "match_found": False,
                "message": "Supabase not configured, operating in standalone mode."
            }
    except Exception as e:
        logger.error(f"Error processing selfie: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing selfie: {str(e)}")

if __name__ == "__main__":
    # Run the server
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("vibe_matcher:app", host="0.0.0.0", port=port, reload=True)