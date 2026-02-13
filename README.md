# AI Photo/Video Detector 🔍

An intelligent AI-powered web application that detects whether images are authentic or AI-generated using heuristic analysis of metadata and image properties.

![AI Detection Tool](https://img.shields.io/badge/AI-Detection-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-teal)

## 🌟 Features

- **Intelligent Heuristic Detection**: Analyzes images without requiring a trained model
- **Metadata Analysis**: Extracts EXIF data including device info, timestamps, and software signatures
- **AI Platform Detection**: Identifies AI generation platforms (Midjourney, DALL-E, Stable Diffusion, etc.)
- **Real-time Processing**: Fast image analysis with instant results
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Detailed Reports**: Shows confidence scores and detection reasoning

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Pillow (PIL)**: Image processing and EXIF extraction
- **TensorFlow**: Deep learning framework (optional for model training)
- **NumPy**: Numerical computations for image analysis

### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **Vanilla JavaScript**: No dependencies, pure JS
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

## 📋 Detection Methods

The application uses multiple heuristic techniques:

1. **Metadata Inspection**
   - Camera make & model detection
   - AI software signature detection
   - Timestamp verification
   - Lens information analysis

2. **Image Property Analysis**
   - Noise pattern detection
   - Color distribution analysis
   - Resolution pattern checking
   - Aspect ratio evaluation

3. **AI Signature Detection**
   - Common AI resolution patterns (512x512, 1024x1024)
   - Unnatural smoothness detection
   - Metadata anomaly identification

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abhisheklabs04/AI-PHOTO-DETECTOR.git
cd AI-PHOTO-DETECTOR
```

2. **Install dependencies**
```bash
pip install fastapi uvicorn pillow numpy tensorflow
```

3. **Run the server**
```bash
python backend/main.py
```

4. **Open in browser**
```
http://127.0.0.1:8000
```

## 📖 Usage

1. **Upload Image**: Drag & drop or click to select an image (JPG, PNG, WebP)
2. **Analyze**: Click "Check Authenticity" to start detection
3. **View Results**: See verdict, confidence score, and detailed analysis

### Result Types

- **AUTHENTIC**: Real photo from camera with device metadata
- **AI-GENERATED**: Synthetic image detected with platform info
- **UNVERIFIED**: Insufficient data for conclusive analysis

## 📁 Project Structure

```
AI-PHOTO_VIDEO-DETECTOR/
├── backend/
│   ├── main.py          # FastAPI server
│   ├── utils.py         # Detection utilities
│   └── model/           # Model directory
├── assets/
│   └── logo.png         # Application logo
├── styles/
│   ├── main.css         # Main stylesheet
│   └── detect.css       # Detection page styles
├── scripts/
│   └── main.js          # Frontend JavaScript
├── index.html           # Landing page
├── detect.html          # Detection page
├── train_model.py       # Model training script
└── .gitignore          # Git ignore rules
```

## 🎯 Accuracy Note

Current heuristic-based detection achieves approximately **70-85% accuracy** depending on metadata availability. For higher accuracy, you can train the deep learning model using the `train_model.py` script with your own dataset.

## 🔒 Privacy

All image processing is done **locally on your machine**. No images are uploaded to external servers.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Abhishek**
- GitHub: [@abhisheklabs04](https://github.com/abhisheklabs04)

## 🙏 Acknowledgments

- TensorFlow for deep learning framework
- FastAPI for the amazing web framework
- Font Awesome for icons
