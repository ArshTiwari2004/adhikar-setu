import streamlit as st
import numpy as np
import cv2
import rasterio
import tensorflow as tf
import json
import os
from rasterio.windows import Window

# ---------------- CONFIG ----------------
MODEL_PATH = "models/fra_land_classifier.keras"
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

patch_size = 64
stride = patch_size
classes = ['agriculture', 'forest', 'water', 'homestead']
color_map = {
    1: (34, 139, 34),   # agriculture -> green
    2: (0, 0, 255),     # forest -> blue
    3: (255, 255, 0),   # water -> yellow
    4: (255, 0, 0)      # homestead -> red
}

# ---------------- LOAD MODEL ----------------
st.title("🌍 Land Cover Classification App")
st.write("Upload an aerial GeoTIFF image and get predicted resource distribution.")

@st.cache_resource
def load_model():
    return tf.keras.models.load_model(MODEL_PATH)

model = load_model()

uploaded_file = st.file_uploader("Upload a GeoTIFF image", type=["tif", "tiff"])

if uploaded_file is not None:
    input_path = os.path.join(OUTPUT_DIR, "uploaded_input.tif")
    with open(input_path, "wb") as f:
        f.write(uploaded_file.read())

    st.success("✅ File uploaded successfully!")
    st.write("Processing... this may take a while ⏳")

    src = rasterio.open(input_path)
    classified = np.zeros((src.height, src.width), dtype=np.uint8)
    counts = {c: 0 for c in classes}
    total_tiles = 0

    for y in range(0, src.height, stride):
        for x in range(0, src.width, stride):
            win_w = min(patch_size, src.width - x)
            win_h = min(patch_size, src.height - y)
            window = Window(x, y, win_w, win_h)
            patch = src.read([1, 2, 3], window=window)
            patch = np.transpose(patch, (1, 2, 0))
            if (win_h != patch_size) or (win_w != patch_size):
                patch = np.pad(
                    patch,
                    ((0, patch_size - win_h), (0, patch_size - win_w), (0, 0)),
                    mode='reflect'
                )

            if patch.max() > 2.0:
                patch_in = patch.astype('float32') / 255.0
            else:
                patch_in = patch.astype('float32')

            pred = model.predict(np.expand_dims(patch_in, 0), verbose=0)
            cls_idx = int(np.argmax(pred, axis=1)[0])
            classified[y:y+win_h, x:x+win_w] = cls_idx + 1
            counts[classes[cls_idx]] += 1
            total_tiles += 1

    # Area calculation
    transform = src.transform
    pixel_area = abs(transform.a * transform.e)
    area_per_class_m2 = {}
    for idx, cls in enumerate(classes, start=1):
        mask = (classified == idx)
        pixel_count = int(mask.sum())
        area_per_class_m2[cls] = pixel_count * pixel_area

    total_area_m2 = sum(area_per_class_m2.values())
    area_percent = {k: (v / total_area_m2) * 100 for k, v in area_per_class_m2.items()}

    # Overlay image
    orig = src.read([1, 2, 3])
    orig = np.transpose(orig, (1, 2, 0))
    if orig.max() > 2.0:
        orig_uint8 = ((orig / orig.max()) * 255).astype(np.uint8)
    else:
        orig_uint8 = (orig * 255).astype(np.uint8)

    mask_rgb = np.zeros_like(orig_uint8, dtype=np.uint8)
    for idx in range(1, len(classes)+1):
        mask_rgb[classified == idx] = color_map.get(idx, (128, 128, 128))

    overlay = cv2.addWeighted(orig_uint8, 0.6, mask_rgb, 0.4, 0)
    overlay_path = os.path.join(OUTPUT_DIR, "classified_overlay.png")
    cv2.imwrite(overlay_path, cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))

    st.image(orig_uint8, caption="Original Image", use_column_width=True)
    st.image(overlay, caption="Classified Overlay", use_column_width=True)

    st.subheader("📊 Land Cover Percentage")
    st.json(area_percent)
