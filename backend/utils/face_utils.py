# utils/face_utils.py
import numpy as np
import tensorflow as tf
import cv2
import os
import pickle
from sklearn.metrics.pairwise import cosine_similarity

def load_facenet_model(model_path="models/facenet_keras.h5"):
    return tf.keras.models.load_model(model_path)

def preprocess_face(img):
    img = cv2.resize(img, (160, 160))
    img = img.astype('float32')
    mean, std = img.mean(), img.std()
    img = (img - mean) / std
    return np.expand_dims(img, axis=0)

def get_embedding(model, face):
    face = preprocess_face(face)
    return model.predict(face)[0]

def save_embeddings(embeddings, labels, path="embeddings/embeddings.pkl"):
    with open(path, "wb") as f:
        pickle.dump({"embeddings": embeddings, "labels": labels}, f)

def load_embeddings(path="embeddings/embeddings.pkl"):
    with open(path, "rb") as f:
        data = pickle.load(f)
    return data["embeddings"], data["labels"]

def recognize_face(model, face_img, threshold=0.5):
    known_embeddings, known_labels = load_embeddings()
    face_embedding = get_embedding(model, face_img)
    similarities = cosine_similarity([face_embedding], known_embeddings)[0]
    max_index = np.argmax(similarities)
    confidence = similarities[max_index]
    
    if confidence > threshold:
        return known_labels[max_index], float(confidence)
    else:
        return "Intruder", float(confidence)
