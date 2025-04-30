from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
import json
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
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
# Set up static file serving for the snapshots directory
Snapshot_dir ="snapshots"
os.makedirs(Snapshot_dir,exist_ok=True)
app.mount("/snapshots", StaticFiles(directory=Snapshot_dir), name="snapshots")
#activity log file
Log_file ="activity_log.json"
if not os.path.exists(Log_file):
    with open(Log_file, "w") as f:
        json.dump([],f)  # Initialize with an empty JSON array


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
        
        #snapshot of the recognized face
        snapshot_name =f"{uuid.uuid4().hex}.jpg"
        snapshot_path =os.path.join(Snapshot_dir, snapshot_name)
        shutil.copyfile(TEMP_IMAGE_PATH, snapshot_path)
        
        # Log the activity
        entry ={
            "id":uuid.uuid4().hex,
            "name":name if name else "Unknown",
            "confidence":confidence,
            "timestamp":datetime.now().isoformat(),
            "type":"known" if name and name !="unknown" else "intruder",
            "image_url":f"/snapshots/{snapshot_name}",
        }
        with open(Log_file, "r+") as f:
            data = json.load(f)
            data.insert(0, entry)  # Insert at the beginning
            f.seek(0)
            data.append(entry)
            json.dump(data, f, indent=2)
            f.truncate()  # Clear the file and write the updated data
        # Clean up
        if os.path.exists(TEMP_IMAGE_PATH):
            os.remove(TEMP_IMAGE_PATH)
        
        #return the results
        
        return JSONResponse(content={
            "predicted_name":entry["name"],
            "confidence":entry["confidence"],
            "image_url":entry["image_url"],
            "message":entry["type"]=="intruder"
            and "this appears to be an intruder,check the logs for more details."
            or None
        })
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
        
@app.get("/activity")
def get_activity():
    with open(Log_file,) as f:
        return json.load(f)