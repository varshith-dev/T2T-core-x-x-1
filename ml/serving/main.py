"""T2T trash-classification service.

Two stages:
  1. GATE (CLIP zero-shot): is this image actually discarded waste, or some random
     object (laptop, keyboard, screen, person, room)? Non-waste never auto-approves.
  2. CLASSIFY (ViT): if it's waste, which of our 8 categories.

Serves:
  GET  /health   -> readiness + model ids
  POST /classify -> { category, confidence, modelVersion, isWaste, wasteScore }
"""
import io
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image
from transformers import pipeline

MODEL_ID = os.environ.get("MODEL_ID", "watersplash/waste-classification")
GATE_MODEL = os.environ.get("GATE_MODEL", "openai/clip-vit-base-patch32")
GATE_MIN = float(os.environ.get("GATE_MIN_SCORE", "0.35"))  # waste share must exceed this

CATEGORIES = {"organic", "plastic", "paper", "cardboard", "metal", "glass", "ewaste", "trash"}
LABEL_MAP = {
    "biological": "organic", "organic": "organic", "food": "organic", "food-waste": "organic",
    "paper": "paper", "cardboard": "cardboard", "metal": "metal", "plastic": "plastic",
    "glass": "glass", "green-glass": "glass", "brown-glass": "glass", "white-glass": "glass",
    "battery": "ewaste", "batteries": "ewaste", "e-waste": "ewaste", "ewaste": "ewaste",
    "clothes": "trash", "shoes": "trash", "trash": "trash", "garbage": "trash",
}

# CLIP gate prompts — is it discarded waste, or an object/scene in normal use?
WASTE_PROMPTS = [
    "a piece of trash or garbage",
    "discarded waste such as a plastic bottle, wrapper, can, paper, glass, or food scraps",
    "litter or rubbish to be thrown in a bin",
]
NOT_WASTE_PROMPTS = [
    "a laptop, computer, or keyboard",
    "a smartphone, television, monitor, or screen",
    "a person, hand, or face",
    "a room, furniture, or indoor scene",
    "a clean new product on display for sale",
]
GATE_LABELS = WASTE_PROMPTS + NOT_WASTE_PROMPTS

# Specific item names (CLIP zero-shot) so we can name the product, not just the category.
ITEM_PROMPTS = [
    "a plastic water bottle", "a plastic bag", "a plastic food container", "a plastic cup",
    "an aluminum drink can", "a metal can", "a metal object",
    "a cardboard box", "a sheet of paper", "a newspaper",
    "a glass bottle", "a glass jar",
    "food scraps or peels", "a fruit or vegetable",
    "a battery", "an electronic device", "a charger or cable",
    "a piece of clothing", "a shoe",
    "general mixed trash",
]
ITEM_NAME = {p: p[2:] if p.startswith("a ") else p[3:] if p.startswith("an ") else p for p in ITEM_PROMPTS}


def normalize(label: str) -> str:
    return str(label).strip().lower().replace("_", "-").replace(" ", "-")


state: dict = {}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    state["clf"] = pipeline("image-classification", model=MODEL_ID)
    state["gate"] = pipeline("zero-shot-image-classification", model=GATE_MODEL)
    yield
    state.clear()


app = FastAPI(title="T2T ML", lifespan=lifespan)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL_ID,
        "gate": GATE_MODEL,
        "ready": "clf" in state and "gate" in state,
    }


@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    clf, gate = state.get("clf"), state.get("gate")
    if clf is None or gate is None:
        raise HTTPException(503, "model not loaded")
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    except Exception:
        raise HTTPException(400, "invalid image")

    # Stage 1: is this actually waste?
    g = gate(img, candidate_labels=GATE_LABELS)
    waste_share = sum(x["score"] for x in g if x["label"] in WASTE_PROMPTS)
    is_waste = waste_share >= GATE_MIN

    # Stage 2: classify into our categories (probabilities aggregated by category)
    preds = clf(img, top_k=None)
    scores: dict[str, float] = {}
    for p in preds:
        cat = LABEL_MAP.get(normalize(p["label"]), "trash")
        scores[cat] = scores.get(cat, 0.0) + float(p["score"])
    best = max(scores, key=lambda k: scores[k]) if scores else "trash"

    # Stage 3: name the specific item (only meaningful when it's waste)
    product_name = None
    if is_waste:
        items = gate(img, candidate_labels=ITEM_PROMPTS)
        product_name = ITEM_NAME.get(items[0]["label"], items[0]["label"])

    return {
        "category": best,
        "confidence": round(min(scores.get(best, 0.0), 1.0), 4),
        "modelVersion": MODEL_ID,
        "isWaste": is_waste,
        "wasteScore": round(waste_share, 4),
        "productName": product_name,
    }
