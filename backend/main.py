# main.py

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import cv2
import pickle
import numpy as np
from utils.face_utils import get_face_embedding

app = FastAPI()

# Load models
with open("models/svc_model.pkl", "rb") as f:
    clf = pickle.load(f)

with open("models/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

@app.get("/recognize")
def recognize_face():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()

    if not ret:
        return JSONResponse(status_code=500, content={"message": "Failed to capture frame."})

    bbox, embedding = get_face_embedding(frame)

    if embedding is None:
        return {"message": "No face detected."}

    # Predict
    probs = clf.predict_proba([embedding])[0]
    pred_index = np.argmax(probs)
    confidence = round(probs[pred_index] * 100, 2)
    predicted_name = label_encoder.inverse_transform([pred_index])[0]

    if confidence < 70:
        return {"message": "Intruder Detected", "confidence": confidence}

    return {
        "message": f"{predicted_name} identified",
        "confidence": confidence,
        "bounding_box": bbox.tolist()
    }
