# face_utils.py

import cv2
import insightface
from insightface.app import FaceAnalysis

app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0)

def get_face_embedding(frame):
    faces = app.get(frame)
    if len(faces) == 0:
        return None, None
    face = faces[0]
    return face.bbox, face.embedding
