# Fake News Detection App

This project consists of a FastAPI backend for detecting fake news using Machine Learning models, and a React frontend to interact with the API.

## Prerequisites
- Python 3.8+ 
- Node.js (v16+ recommended)
- npm or pnpm

## Project Structure
- `/` (Root): Contains the FastAPI application (`main.py`), pre-trained ML models (`.pkl` files), and requirements.
- `/my-react-app`: Contains the React frontend application built with Vite.

## 1. Running the FastAPI Backend

1. **Navigate to the project root directory** (where `main.py` is located).

2. **Activate the virtual environment** (recommended):
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload
   ```
   The API will start running at `http://localhost:8000`. You can access the interactive API documentation at `http://localhost:8000/docs`.

## 2. Running the React Frontend

1. **Open a new terminal window** and navigate to the React app directory:
   ```bash
   cd my-react-app
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm run dev
   ```
   The frontend will typically start at `http://localhost:5173`. Open this URL in your browser to interact with the application.

## Usage
Once both servers are running locally, open the frontend URL (`http://localhost:5173`) in your web browser. You can enter the text of a news article, and the React app will send it to the FastAPI backend, which will run it through the models and return a prediction (REAL or FAKE) along with confidence scores.
