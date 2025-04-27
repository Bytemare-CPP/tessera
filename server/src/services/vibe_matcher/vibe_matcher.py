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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("vibe-matcher")

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
        
        # Convert to numpy array for serialization
        embedding_np = embedding.cpu().numpy()
        
        return {
            "user_id": user_id,
            "embedding_shape": embedding_np.shape,
            "processed": True,
            "message": "Selfie processed successfully. In a full implementation, this would save the embedding to a database."
        }
    except Exception as e:
        logger.error(f"Error processing selfie: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing selfie: {str(e)}")

if __name__ == "__main__":
    # Run the server
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("vibe_matcher:app", host="0.0.0.0", port=port, reload=True)