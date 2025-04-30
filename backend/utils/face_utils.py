import os
import cv2
import numpy as np
import joblib
from keras_facenet import FaceNet
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline

# Initialize FaceNet embedder
embedder = FaceNet()

# Set paths - use absolute paths to avoid issues
dataset_path = r"C:/project fourth year/known people"
# Get the base directory from where the script is running
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Ensure models directory exists
models_dir = os.path.join(BASE_DIR, "backend", "models")
os.makedirs(models_dir, exist_ok=True)
MODEL_PATH = os.path.join(models_dir, "svm_classifier.pkl")

def extract_face(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = embedder.extract(img_rgb, threshold=0.95)
    if faces:
        return faces[0]["embedding"]
    return None

def train_faces():
    X, y = [], []
    
    # Check if dataset path exists and is accessible
    if not os.path.exists(dataset_path):
        raise Exception(f"Dataset path not found: {dataset_path}")
    
    person_folders = os.listdir(dataset_path)
    if not person_folders:
        raise Exception(f"No person folders found in: {dataset_path}")
    
    print(f"Found {len(person_folders)} person folders")
    
    for person in person_folders:
        person_dir = os.path.join(dataset_path, person)
        if not os.path.isdir(person_dir):
            continue
            
        image_files = os.listdir(person_dir)
        print(f"Processing {len(image_files)} images for {person}")
        
        for image_name in image_files:
            image_path = os.path.join(person_dir, image_name)
            embedding = extract_face(image_path)
            if embedding is not None:
                X.append(embedding)
                y.append(person)
            else:
                print(f"No face detected in {image_path}")

    if not X:
        raise Exception("No faces found to train on. Please check your 'known people' folder.")

    print(f"Training with {len(X)} face embeddings across {len(set(y))} people")
    
    X = np.array(X)
    y = np.array(y)

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    classifier = SVC(kernel='linear', probability=True)
    model = Pipeline([('classifier', classifier)])
    model.fit(X, y_encoded)

    # Make sure the directory exists before saving
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
    try:
        joblib.dump((model, le), MODEL_PATH)
        print(f"Model successfully saved to {MODEL_PATH}")
    except Exception as e:
        print(f"Error saving model: {e}")
        
    return le.classes_.tolist()

def recognize_face(img_path, confidence_threshold=0.875):
    embedding = extract_face(img_path)
    if embedding is None:
        return None, 0.0

    if not os.path.exists(MODEL_PATH):
        return "Model not trained yet", 0.0

    model, le = joblib.load(MODEL_PATH)
    probs = model.predict_proba([embedding])[0]
    idx = np.argmax(probs)
    confidence = float(probs[idx])
    
    # If confidence is below threshold, classify as unknown
    if confidence < confidence_threshold:
        return "Unknown", confidence
    
    # Otherwise return the predicted name
    name = le.inverse_transform([idx])[0]
    return name, confidence