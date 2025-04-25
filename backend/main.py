from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
import os
from backend.utils.face_utils import train_faces, recognize_face

app = FastAPI()

TEMP_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "temp_image.jpg")

@app.get("/")
def root():
    return {"message": "Face Recognition API is working. Go to /docs for Swagger UI."}

@app.post("/train/")
def train_known_faces():
    try:
        class_names = train_faces()
        return {"message": "Training completed successfully.", "classes": class_names}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

@app.post("/recognize/")
async def recognize_uploaded_face(file: UploadFile = File(...)):
    try:
        with open(TEMP_IMAGE_PATH, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Pass the threshold parameter to recognize_face
        name, confidence = recognize_face(TEMP_IMAGE_PATH, confidence_threshold=0.9)
        
        # Clean up
        if os.path.exists(TEMP_IMAGE_PATH):
            os.remove(TEMP_IMAGE_PATH)
        
        if name is None:
            return JSONResponse(status_code=404, content={"error": "No face detected in the image."})
        
        if name == "Unknown":
            return JSONResponse(
                status_code=200, 
                content={
                    "predicted_name": "Unknown", 
                    "confidence": confidence,
                    "message": "This appears to be someone not in the known people database."
                }
            )

        return {
            "predicted_name": name,
            "confidence": confidence
        }
    except Exception as e:
        if os.path.exists(TEMP_IMAGE_PATH):
            os.remove(TEMP_IMAGE_PATH)
        return JSONResponse(status_code=500, content={"error": f"An error occurred: {str(e)}"})
