# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from backend.utils.face_utils import load_facenet_model, recognize_face, save_embeddings, get_embedding
import os
import pickle

def load_embeddings():
    """Load embeddings and labels from a file."""
    if os.path.exists("embeddings.pkl"):
        with open("embeddings.pkl", "rb") as f:
            data = pickle.load(f)
        return data["embeddings"], data["labels"]
    else:
        raise FileNotFoundError("Embeddings file not found.")

app = FastAPI()
model_path = "backend/models/facenet_keras (2).h5"
model = load_facenet_model(model_path)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this when connecting frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_facenet_model()

@app.post("/train/")
async def train_faces(person_name: str, files: list[UploadFile] = File(...)):
    embeddings = []
    for file in files:
        img_data = await file.read()
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        embedding = get_embedding(model, img)
        embeddings.append(embedding)

    try:
        existing_embeddings, labels = load_embeddings()
        existing_embeddings += embeddings
        labels += [person_name] * len(embeddings)
    except FileNotFoundError:
        existing_embeddings, labels = embeddings, [person_name] * len(embeddings)

    save_embeddings(existing_embeddings, labels)
    return {"message": f"Trained {len(embeddings)} face(s) for {person_name}"}


@app.post("/recognize/")
async def recognize(file: UploadFile = File(...)):
    img_data = await file.read()
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    name, confidence = recognize_face(model, img)
    return {"name": name, "confidence": round(confidence * 100, 2)}
