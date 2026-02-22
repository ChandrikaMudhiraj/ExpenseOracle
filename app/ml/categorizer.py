from typing import Dict
import os
import joblib
from pathlib import Path


MODEL_PATH = Path(__file__).parent / "models" / "categorizer.pkl"
VECT_PATH = Path(__file__).parent / "models" / "categorizer_vect.pkl"


class MerchantCategorizer:
    """Categorizer that attempts to load a trained model and vectorizer.

    If a persisted model isn't present, falls back to a lightweight rule-based
    categorizer to remain operational.
    """

    _model = None
    _vect = None

    @classmethod
    def _load(cls):
        if cls._model is not None:
            return
        try:
            if MODEL_PATH.exists() and VECT_PATH.exists():
                cls._model = joblib.load(MODEL_PATH)
                cls._vect = joblib.load(VECT_PATH)
        except Exception:
            cls._model = None
            cls._vect = None

    @classmethod
    def categorize(cls, title: str) -> Dict[str, str]:
        cls._load()
        t = (title or "")
        if cls._model and cls._vect:
            try:
                x = cls._vect.transform([t])
                pred = cls._model.predict_proba(x)[0]
                label = cls._model.classes_[pred.argmax()]
                confidence = float(pred.max())
                return {"category": label, "confidence": confidence}
            except Exception:
                # fall back to rules
                pass

        # fallback simple rules
        lt = t.lower()
        if any(k in lt for k in ("starbuck", "coffee", "latte")):
            cat = "coffee"
        elif any(k in lt for k in ("uber", "lyft", "taxi")):
            cat = "transport"
        elif any(k in lt for k in ("walmart", "target", "grocery", "market")):
            cat = "groceries"
        else:
            cat = "uncategorized"

        return {"category": cat, "confidence": 0.6}

