"""
API FAST API DU SYSTEM 

POUR LANCER LE SERVEUR : uvicorn main:app --reload --port 8000

http://localhost:8000/docs
"""

from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import database
import recommend

app=FastAPI(title="Travel Match API", description="API pour le système de recommandation de voyages")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    recommend.load_models()
    recommend.refresh_cache()

@app.get("/users")
def list_users():
    return {"destinations": database.get_all_destinations()}

class SearchRequest(BaseModel):
    query: str
    user_preferences: dict
    alpha: float = 0.6
    beta: float = 0.4
    top: int = 5
    
@app.post("/recommend")
def recommend_destinations(request: SearchRequest):
    try:
        results =recommend.recommend_hybrid(
            query=request.query,
            user_preferences=request.user_preferences,
            alpha=request.alpha,
            beta=request.beta,
            top=request.top
        )
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))