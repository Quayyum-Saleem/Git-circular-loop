from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from app.schemas.schemas import AIClassificationResponse
from app.services.classifier import analyze_item_image

router = APIRouter(prefix="/classify", tags=["AI Image Classification"])

@router.post("/suggest-category", response_model=AIClassificationResponse)
async def suggest_category(
    file: Optional[UploadFile] = File(None),
    item_title: Optional[str] = Form(None)
):
    """
    Modular image classification service.
    If image uploaded: analyzes image format, dimensions, and filename heuristics.
    If item_title provided: uses title context.
    Clearly discloses suggestion source ('heuristic_vision_v1' or 'demo_model').
    """
    filename = file.filename if file else (item_title or "")
    image_bytes = b""
    if file:
        image_bytes = await file.read()

    result = analyze_item_image(image_bytes=image_bytes, filename=filename)
    return AIClassificationResponse(**result)
