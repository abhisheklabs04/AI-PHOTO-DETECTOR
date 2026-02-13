import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models, optimizers
import os

# Define constants
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_DIR = "dataset"
MODEL_SAVE_PATH = "backend/model/fake_image_detector.h5"

def train_model():
    """
    Trains a MobileNetV2 based model for Real vs Fake image detection.
    """
    print("Checking dataset directory...")
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset directory '{DATASET_DIR}' not found.")
        print("Please create 'dataset/real' and 'dataset/fake' and add images.")
        return

    # Data Augmentation setup
    # Rescale pixels to [0, 1] and add augmentations
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,     # Random rotation
        zoom_range=0.15,       # Random zoom
        width_shift_range=0.2, # Shift horizontally
        height_shift_range=0.2,# Shift vertically
        horizontal_flip=True,  # Random flip
        validation_split=0.2   # Use 20% of data for validation
    )

    print("Loading images...")
    # Load Training Data
    try:
        train_generator = train_datagen.flow_from_directory(
            DATASET_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='binary', # Real vs Fake
            subset='training'
        )

        # Load Validation Data
        validation_generator = train_datagen.flow_from_directory(
            DATASET_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='binary',
            subset='validation'
        )
    except Exception as e:
        print(f"Error loading images: {e}")
        return

    if train_generator.samples == 0:
        print("No images found! Please ensure 'dataset/real' and 'dataset/fake' contain images.")
        return

    print("Building model...")
    # Load MobileNetV2 with ImageNet weights, exclude top layers
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

    # Freeze the base model layers (Transfer Learning)
    base_model.trainable = False

    # Create the new model
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2), # Dropout for regularization
        layers.Dense(1, activation='sigmoid') # Output layer: 0-1 (Fake/Real)
    ])

    # Compile the model
    model.compile(
        optimizer=optimizers.Adam(learning_rate=0.0001), # Low learning rate for fine-tuning
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    print("Starting training...")
    # Train the model
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )

    # Save the trained model
    print(f"Saving model to {MODEL_SAVE_PATH}...")
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    model.save(MODEL_SAVE_PATH)
    print("Model saved successfully!")

if __name__ == "__main__":
    train_model()
