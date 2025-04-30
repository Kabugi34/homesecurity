from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import shutil
import os
from backend.utils.face_utils import train_faces, recognize_face
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#configuring CORS middleware to allow requests from the frontend
# This is important for local development when the frontend and backend are on different ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #allow request from frontend
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)
base_dir = "C:/project fourth year/known people"

TEMP_IMAGE_PATH = os.path.join(os.path.dirname(__file__), "temp_image.jpg")

@app.get("/")
def root():
    return {"message": "Face Recognition API is working. Go to /docs for Swagger UI."}

dataset_path = os.path.join(os.path.dirname(__file__), "known_people")

#endpoint to add a person to the known people dataset
@app.post("/add_person")
async def add_person(name: str = Form(...), details: str = Form(None), images: list[UploadFile] = File(...)):
    base_dir ="C:/project fourth year/known people"
    person_dir =os.path.join(base_dir, name)
    os.makedirs(person_dir, exist_ok=True)
    for image in images:
        image_path=os.path.join(person_dir, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    return {"message":f"succesfully added {name} with {len(images)} images."}
    
#endpoint to remove a person from the know people dataset
@app.post("/remove_person")
async def remove_person(name: str = Form(...)):
    name = name.strip().lower()
    print(f"Received request to remove: '{name}'")

    # Search for folder in known_people directory without case sensitivity
    folders = os.listdir(base_dir)
    folder_to_delete = None

    for folder in folders:
        if folder.lower() == name:
            folder_to_delete = os.path.join(base_dir, folder)
            break

    if folder_to_delete and os.path.isdir(folder_to_delete):
        shutil.rmtree(folder_to_delete)
        return {"message": f"Removed '{folder}' and their images."}
    else:
        return {"message": f"No folder found for '{name}'."}
    

@app.post("/train/")
def train_known_faces():
    try:
        class_names = train_faces()
        return {"message": "Training completed successfully.", "classes": class_names}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

@app.post("/recognize")
async def recognize_uploaded_face(file: UploadFile = File(...)):
    try:
        with open(TEMP_IMAGE_PATH, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Pass the threshold parameter to recognize_face
        name, confidence = recognize_face(TEMP_IMAGE_PATH, confidence_threshold=0.875)
        
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
