"""
Modular Image Classification Service for CircularLoop.
Provides image validation, heuristic visual feature extraction,
and clearly labelled category suggestions.
"""

from io import BytesIO
from typing import Dict, Any, List
from PIL import Image

CATEGORIES = [
    "Electronics",
    "Books and educational materials",
    "Furniture",
    "Clothing and accessories",
    "Home appliances",
    "Household items",
    "Sports and recreation",
    "Other"
]

def analyze_item_image(image_bytes: bytes, filename: str = "") -> Dict[str, Any]:
    """
    Validates uploaded image and provides rule-based heuristic category suggestions.
    Always transparently exposes the suggestion source and confidence.
    """
    try:
        img = Image.open(BytesIO(image_bytes))
        img.verify()
        # Re-open after verify() resets file pointer
        img = Image.open(BytesIO(image_bytes))
        width, height = img.size
        aspect_ratio = width / max(height, 1)
        format_name = img.format or "JPEG"
    except Exception as e:
        return {
            "suggested_category": "Other",
            "confidence": 0.35,
            "alternative_categories": ["Household items", "Electronics"],
            "suggested_purpose": "Give away",
            "suggested_condition": "Good",
            "explanation": f"Image format check fallback: {str(e)}",
            "source": "fallback_manual_mode"
        }

    # Keyword heuristics on filename if provided
    fname_lower = filename.lower()
    keyword_map = {
        "Electronics": ["laptop", "phone", "macbook", "computer", "screen", "monitor", "charger", "mouse", "keyboard", "headphones", "ipad", "tablet", "pc", "tech"],
        "Books and educational materials": ["book", "textbook", "novel", "notes", "calculus", "physics", "guide", "paper", "reader", "binder"],
        "Furniture": ["chair", "desk", "table", "sofa", "lamp", "shelf", "cabinet", "bed", "stool", "drawer"],
        "Clothing and accessories": ["jacket", "shirt", "coat", "hoodie", "shoes", "boots", "dress", "pants", "hat", "bag", "backpack"],
        "Home appliances": ["microwave", "toaster", "blender", "kettle", "fridge", "iron", "heater", "fan", "vacuum"],
        "Household items": ["mug", "pan", "plate", "pot", "cutlery", "curtain", "cushion", "mirror", "clock"],
        "Sports and recreation": ["bike", "bicycle", "racket", "ball", "skate", "yoga", "gym", "weights", "helmet"]
    }

    detected_category = None
    detected_keyword = ""
    for cat, words in keyword_map.items():
        for word in words:
            if word in fname_lower:
                detected_category = cat
                detected_keyword = word
                break
        if detected_category:
            break

    if detected_category:
        suggested = detected_category
        confidence = 0.88
        explanation = f"Heuristic matched file attribute '{detected_keyword}' associated with '{suggested}'."
        source = "heuristic_vision_v1"
    else:
        # Visual dimension heuristic:
        # Tall portraits (aspect_ratio < 0.8) often correspond to clothing, lamps, or books
        # Wide landscapes (aspect_ratio > 1.3) often correspond to laptops, desks, sofas, keyboards
        if aspect_ratio > 1.3:
            suggested = "Electronics"
            confidence = 0.65
            explanation = f"Landscape aspect ratio ({aspect_ratio:.2f}) indicates potential desktop hardware, laptop, or furniture."
        elif aspect_ratio < 0.8:
            suggested = "Clothing and accessories"
            confidence = 0.60
            explanation = f"Vertical aspect ratio ({aspect_ratio:.2f}) matches common apparel or reading material framing."
        else:
            suggested = "Household items"
            confidence = 0.55
            explanation = "Balanced aspect framing typical of compact home items or appliances."
        source = "heuristic_vision_v1"

    alternatives = [c for c in CATEGORIES if c != suggested][:3]

    return {
        "suggested_category": suggested,
        "confidence": round(confidence, 2),
        "alternative_categories": alternatives,
        "suggested_purpose": "Give away" if suggested in ["Books and educational materials", "Clothing and accessories"] else "Sell for reuse",
        "suggested_condition": "Good",
        "explanation": explanation,
        "source": source
    }
