from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os,smtplib
from email.message import EmailMessage
import uuid
import json
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime ,timezone
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from backend.utils.face_utils import train_faces, recognize_face
from fastapi.middleware.cors import CORSMiddleware
from Routes.Reports import router as reports_router
from dotenv import load_dotenv
load_dotenv(dotenv_path="c:/project fourth year/frontend/.env")

app = FastAPI()
app.include_router(reports_router)


#configuring CORS middleware to allow requests from the frontend
# This is important for local development when the frontend and backend are on different ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #allow request from frontend
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
base_dir = "C:/project fourth year/known people"
# Set up static file serving for the snapshots directory
Snapshot_dir ="snapshots"
CONFIG_PATH ="config.json "
os.makedirs(Snapshot_dir,exist_ok=True)
app.mount("/snapshots", StaticFiles(directory=Snapshot_dir), name="snapshots")
#activity log file
Log_file ="activity_log.json"
for path, init in [
    (Log_file,      []),
    (CONFIG_PATH, {"alert_email": ""}),
]:
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump(init, f)


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
        clean_name = name or "Unknown"
        is_intruder = clean_name.lower() == "unknown"

        entry = {
        "id": uuid.uuid4().hex,
        "name": clean_name,
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "type": "Intruder" if is_intruder else "Known",
        "image_url": f"/snapshots/{snapshot_name}"
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
    
@app.delete("/activity/{entry_id}")
def delete_activity_entry(entry_id: str):
    # Load log
    try:
        with open(Log_file, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Log file not found")

    # Filter out the one entry
    new_data = [e for e in data if e["id"] != entry_id]

    # If nothing changes the  ID is wrong
    if len(new_data) == len(data):
        raise HTTPException(404, f"No entry with id {entry_id}")

    # Save back
    with open(Log_file, "w") as f:
        json.dump(new_data, f, indent=2)

    return {"message": "Entry deleted successfully."}
    
CONFIG_PATH ="config.json "
    
def get_alert_email() -> str:
    with open(CONFIG_PATH, "r") as f:
        return json.load(f).get("alert_email", "").strip()
 
def set_alert_email(address: str):
    cfg = {}
    with open(CONFIG_PATH, "r") as f:
        cfg = json.load(f)
    cfg["alert_email"] = address
    with open(CONFIG_PATH, "w") as f:
        json.dump(cfg, f, indent=2)
    
    
@app.post("/recognize_live")
async def recognize_live_face(file: UploadFile = File(...)):
    # 1) Save temp
    temp_path = "temp.jpg"
    with open(temp_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    # 2) Recognize
    name, confidence = recognize_face(temp_path, confidence_threshold=0.875)

    # 3) Save snapshot
    snapshot_name = f"{uuid.uuid4().hex}.jpg"
    snapshot_path = os.path.join(Snapshot_dir, snapshot_name)
    shutil.copyfile(temp_path, snapshot_path)

    # 4) Log & possibly email
    entry = {
        "id": uuid.uuid4().hex,
        "name": name or "Unknown",
        "confidence": round(confidence * 100, 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "type": "Known" if name and name != "Unknown" else "Intruder",
        "image_url": f"/snapshots/{snapshot_name}"
    }
    # prepend to log
    with open(Log_file, "r+") as f:
        data = json.load(f)
        data.insert(0, entry)
        f.seek(0); json.dump(data, f, indent=2); f.truncate()

    # 5) If intruder, send email
    if entry["type"] == "Intruder":
        try:
            send_intruder_email(snapshot_path)
        except Exception as e:
            print("Email send failed:", e)


    os.remove(temp_path)
    return JSONResponse(content={
        "predicted_name": entry["name"],
        "confidence": entry["confidence"],
        "type": entry["type"]
    })
    

def send_confirmation_email(to_email: str):
    try:
        print(f"SMTP_USER: {SMTP_USER}, SMTP_HOST: {SMTP_HOST}, SMTP_PORT: {SMTP_PORT}")
        msg = MIMEMultipart()
        msg["Subject"] = "Alert Email Confirmation"
        msg["From"] = SMTP_USER
        msg["To"] = to_email

        body = MIMEText("You have been set to receive intruder alerts.", "plain")
        msg.attach(body)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.set_debuglevel(1)  # Enable debug output
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        print(f"Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"Error: {e}")

    
def send_intruder_email(snapshot_path: str):
    recipient = get_alert_email()
    if not recipient:
        print("No alert email configured. Skipping intruder alert email.")
        return

    try:
        msg = MIMEMultipart()
        msg["Subject"] = "Intruder Detected!"
        msg["From"] = SMTP_USER
        msg["To"] = recipient

        msg.attach(MIMEText("An intruder has been detected. See the attached snapshot."))

        with open(snapshot_path, "rb") as f:
            img_data = f.read()
            image = MIMEImage(img_data)
            image.add_header("Content-Disposition", "attachment", filename=os.path.basename(snapshot_path))
            msg.attach(image)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

        print(f"Intruder alert email sent to {recipient}.")

    except smtplib.SMTPException as e:
        print(f"SMTP error occurred while sending intruder email: {e}")
    except Exception as e:
        print(f"Unexpected error while sending intruder email: {e}")

    
@app.get("/notifications/email")
def fetch_alert_email():
    return {"email": get_alert_email()}

@app.post("/notifications/email")
def update_alert_email(email: str = Form(...)):
    set_alert_email(email)
    send_confirmation_email(email)
    return {"message": f"Alert email updated and confirmation sent to {email}"}

@app.get("/notifications/intruders")
def get_intruder_logs():
    with open(Log_file, "r") as f:
        data = json.load(f)
    return [e for e in data if e.get("type") == "Intruder"]
