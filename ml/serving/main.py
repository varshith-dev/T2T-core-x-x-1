"""T2T trash-classification service.

Loads an existing pre-trained garbage classifier (no training) and serves:
  GET  /health   -> readiness + model id
  POST /classify -> { category, confidence, modelVersion }

The model's own labels are mapped onto our segregation taxonomy (LABEL_MAP), and
probabilities of classes that map to the same category are summed (e.g. the three
glass subtypes -> "glass"). Swap MODEL_ID to try another model; adjust LABEL_MAP
if its labels differ.
"""
import io
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image
from transformers import pipeline

# ViT, 12 classes incl. biological (organic) + battery (e-waste). Loads via the
# transformers image-classification pipeline; runs on CPU (no GPU needed).
MODEL_ID = os.environ.get("MODEL_ID", "watersplash/waste-classification")

# Our segregation categories (must match @t2t/shared CATEGORIES).
CATEGORIES = {"organic", "plastic", "paper", "cardboard", "metal", "glass", "ewaste", "trash"}

# Map a model's raw label (normalised) -> our category.
LABEL_MAP = {
    "biological": "organic",
    "organic": "organic",
    "food": "organic",
    "food-waste": "organic",
    "paper": "paper",
    "cardboard": "cardboard",
    "metal": "metal",
    "plastic": "plastic",
    "glass": "glass",
    "green-glass": "glass",
    "brown-glass": "glass",
    "white-glass": "glass",
    "battery": "ewaste",
    "batteries": "ewaste",
    "e-waste": "ewaste",
    "ewaste": "ewaste",
    "clothes": "trash",
    "shoes": "trash",
    "trash": "trash",
    "garbage": "trash",
}


def normalize(label: str) -> str:
    return str(label).strip().lower().replace("_", "-").replace(" ", "-")


state: dict = {}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    state["clf"] = pipeline("image-classification", model=MODEL_ID)
    yield
    state.clear()


app = FastAPI(title="T2T ML", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_ID, "ready": "clf" in state}


@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    clf = state.get("clf")
    if clf is None:
        raise HTTPException(503, "model not loaded")
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    except Exception:
        raise HTTPException(400, "invalid image")

    preds = clf(img, top_k=None)  # all classes, so we can aggregate by category
    scores: dict[str, float] = {}
    for p in preds:
        cat = LABEL_MAP.get(normalize(p["label"]), "trash")
        scores[cat] = scores.get(cat, 0.0) + float(p["score"])

    if not scores:
        return {"category": "trash", "confidence": 0.0, "modelVersion": MODEL_ID}
    best = max(scores, key=lambda k: scores[k])
    return {"category": best, "confidence": min(scores[best], 1.0), "modelVersion": MODEL_ID}
