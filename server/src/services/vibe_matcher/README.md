# Write the README we created to the new location
cat > /Users/alexmatei/git/tessera/server/src/services/vibe_matcher/README.md << 'EOF'
# Vibe Matcher

A computer vision service that matches selfies based on visual context similarity.

## Overview

The Vibe Matcher uses the CLIP (Contrastive Language-Image Pre-training) model to generate embeddings from selfie images. These embeddings capture the visual context of the image, including background, clothing, lighting, and environment. When two people take selfies in the same location, the service can detect the similarity and propose a connection.

## How It Works

1. **Image Processing**: When a selfie is uploaded, it's processed by the CLIP model to generate a 512-dimensional vector embedding
2. **Similarity Matching**: The service compares embeddings using cosine similarity to determine if two images were taken in the same context
3. **Connection Proposal**: If the similarity exceeds a threshold (default 0.85), the system proposes a connection between the users

## Technical Components

- **FastAPI Server**: Handles HTTP requests for image processing and comparison
- **CLIP Model**: Generates consistent embeddings from images
- **Cosine Similarity**: Measures how similar two embeddings are (range from -1 to 1, with 1 being identical)

## Setup and Installation

```bash
# Navigate to the vibe_matcher directory
cd /path/to/tessera/server/src/services/vibe_matcher

# Create a virtual environment
python -m venv venv

# Activate the environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python vibe_matcher.py

# Compare two images
curl -X POST http://localhost:8000/compare \
  -F "image1=@test_images/GOOD1a.jpg" \
  -F "image2=@test_images/GOOD1b.jpg" \
  -F "threshold=0.90"

# Process a single selfie
curl -X POST http://localhost:8000/process-selfie \
  -F "selfie=@test_images/GOOD1a.jpg" \
  -F "user_id=user123"