from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
from typing import List, Dict
import os

app = FastAPI(title="Garbage Classifier API", version="1.0.0")

# Configure CORS to allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and categories
model = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "garbage_classifier_fixed.keras")

# Define your 6 categories - MUST match the model's training order!
# ⚠️ ASK YOUR FRIEND FOR THE EXACT ORDER!
CATEGORIES = [
    "cardboard",
    "glass", 
    "metal",
    "paper",
    "plastic",
    "trash",
]

# Disposal tips for each category
TIPS = {
    "recyclable": "Rinse recyclables to remove food residue before placing them in the bin.",
    "non-recyclable": "Consider reusing or disposing of non-recyclables responsibly.",
    "cardboard": "Flatten cardboard boxes to save space in the recycling bin.",
    "glass": "Remove caps and rinse glass containers before recycling.",
    "metal": "Clean metal cans and check local guidelines for aerosol cans.",
    "paper": "Avoid recycling wet or heavily soiled paper.",
    "plastic": "Check resin codes; not all plastics are accepted in every program.",
    "trash": "If unsure, check your municipality's waste guide to avoid contamination.",
}


class ImageRequest(BaseModel):
    image: str  # Base64 encoded image with data URL prefix


class PredictionScore(BaseModel):
    label: str
    confidence: float


class ClassificationResponse(BaseModel):
    top: PredictionScore
    scores: List[PredictionScore]
    tip: str


def load_model():
    """Load the H5 model on startup"""
    global model
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"⚠️  Model file not found at: {MODEL_PATH}")
            print(f"   Please place your 'garbage_classifier.h5' file in the 'models' folder")
            return
        
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"✅ Model loaded successfully from {MODEL_PATH}")
        print(f"   Model input shape: {model.input_shape}")
        print(f"   Model output shape: {model.output_shape}")
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        model = None


def preprocess_image(base64_image: str, target_size=(224, 224)):
    """
    Convert base64 image to preprocessed numpy array
    Adjust target_size based on your model's input requirements
    """
    try:
        # Remove data URL prefix if present
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]
        
        # Decode base64
        image_bytes = base64.b64decode(base64_image)
        
        # Open image with PIL
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Resize to model's expected input size
        image = image.resize(target_size)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values to [0, 1] - adjust if your model expects different normalization
        img_array = img_array.astype(np.float32) / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")


@app.on_event("startup")
async def startup_event():
    """Load model when the API starts"""
    load_model()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "Garbage Classifier API",
        "model_loaded": model is not None
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy" if model is not None else "model_not_loaded",
        "model_path": MODEL_PATH,
        "model_exists": os.path.exists(MODEL_PATH),
        "categories": CATEGORIES
    }


@app.post("/classify", response_model=ClassificationResponse)
async def classify_image(request: ImageRequest):
    """
    Classify a garbage image
    Expects a base64 encoded image in the request body
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please ensure the model file is in the models folder."
        )
    
    try:
        # Preprocess the image
        img_array = preprocess_image(request.image)
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        
        # Get prediction probabilities (assuming model outputs probabilities)
        if len(predictions.shape) == 2:
            predictions = predictions[0]  # Remove batch dimension
        
        # Create scores for all categories
        scores = []
        for i, category in enumerate(CATEGORIES):
            confidence = float(predictions[i]) if i < len(predictions) else 0.0
            scores.append(PredictionScore(
                label=category,
                confidence=round(confidence, 2)
            ))
        
        # Sort by confidence (highest first)
        scores.sort(key=lambda x: x.confidence, reverse=True)
        
        # Get top prediction
        top = scores[0]
        
        # Get disposal tip
        tip = TIPS.get(top.label, "Dispose according to local guidelines.")
        
        return ClassificationResponse(
            top=top,
            scores=scores,
            tip=tip
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")


@app.post("/test")
async def test_endpoint(request: ImageRequest):
    """Test endpoint to verify image processing without model"""
    try:
        img_array = preprocess_image(request.image)
        return {
            "success": True,
            "message": "Image processed successfully",
            "shape": img_array.shape,
            "dtype": str(img_array.dtype)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
