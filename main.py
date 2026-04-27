import re
import string
import pickle
import os
from contextlib import asynccontextmanager

import nltk
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

#  NLTK resources 
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("wordnet", quiet=True)
nltk.download("omw-1.4", quiet=True)

#  Global model state 
models: dict = {}

MODEL_FILES = {
    "logistic_regression": "LogisticRegression_model.pkl",
    "decision_tree":       "DecisionTree_model.pkl",
    "gradient_boosting":   "GradientBoosting_model.pkl",
    "random_forest":       "RandomForest_model.pkl",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load saved models and TF-IDF vectorizer on startup."""
    missing = []

    if os.path.exists("tfidf_vectorizer.pkl"):
        with open("tfidf_vectorizer.pkl", "rb") as f:
            models["tfidf"] = pickle.load(f)
    else:
        missing.append("tfidf_vectorizer.pkl")

    for name, filename in MODEL_FILES.items():
        if os.path.exists(filename):
            with open(filename, "rb") as f:
                models[name] = pickle.load(f)
        else:
            missing.append(filename)

    if missing:
        print(
            f"Warning: the following model files were not found: {missing}\n"
            "   Run train.py first to generate them."
        )
    else:
        print("All models loaded successfully.")

    yield

    models.clear()


#  App
app = FastAPI(
    title="Fake News Detection API",
    description=(
        "Detect whether a news article is **real** or **fake** using four "
        "classical ML models trained with TF-IDF features."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# Schemas
class PredictRequest(BaseModel):
    text: str 
    model: str = Field(
        default="logistic_regression",
        description=(
            "Model to use: logistic_regression | decision_tree | "
            "gradient_boosting | random_forest"
        ),
    )


class PredictResponse(BaseModel):
    label: str          # "REAL" or "FAKE"
    confidence: float   # probability of the predicted class
    model_used: str


class AllModelsResponse(BaseModel):
    text_preview: str
    predictions: dict[str, str]   # model_name -> "REAL" | "FAKE"


#  Text preprocessing (mirrors the notebook) 
_lemmatizer = WordNetLemmatizer()

def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"\n", "", text)
    text = re.sub(r"[%s]" % re.escape(string.punctuation), "", text)
    tokens = word_tokenize(text)
    tokens = [_lemmatizer.lemmatize(t) for t in tokens]
    return " ".join(tokens)


def _get_model(name: str):
    if "tfidf" not in models:
        raise HTTPException(
            status_code=503,
            detail="TF-IDF vectorizer not loaded. Run train.py first.",
        )
    if name not in models:
        valid = list(MODEL_FILES.keys())
        raise HTTPException(
            status_code=404,
            detail=f"Model '{name}' not found. Valid options: {valid}",
        )
    return models["tfidf"], models[name]


#  Endpoints 

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict(request: PredictRequest):
    """
    Classify a news article as **REAL (1)** or **FAKE (0)** using a single model.
    Returns the predicted label and the model's confidence score.
    """
    tfidf, clf = _get_model(request.model)
    cleaned = preprocess(request.text)
    vec = tfidf.transform([cleaned])

    pred = clf.predict(vec)[0]
    label = "REAL" if pred == 1 else "FAKE"

    # Confidence: use predict_proba when available, else 1.0
    try:
        proba = clf.predict_proba(vec)[0]
        confidence = float(max(proba))
    except AttributeError:
        confidence = 1.0

    return PredictResponse(label=label, confidence=round(confidence, 4), model_used=request.model)


@app.post("/predict/all", response_model=AllModelsResponse, tags=["Prediction"])
def predict_all(request: PredictRequest):
    """
    Run the article through **all four** loaded models and return every result.
    """
    if "tfidf" not in models:
        raise HTTPException(status_code=503, detail="Models not loaded. Run train.py first.")

    cleaned = preprocess(request.text)
    vec = models["tfidf"].transform([cleaned])

    predictions = {}
    for name in MODEL_FILES:
        if name in models:
            pred = models[name].predict(vec)[0]
            predictions[name] = "REAL" if pred == 1 else "FAKE"

    return AllModelsResponse(
        text_preview=request.text[:120] + ("…" if len(request.text) > 120 else ""),
        predictions=predictions,
    )