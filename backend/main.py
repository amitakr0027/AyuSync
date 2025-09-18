# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
import os
import json
from datetime import datetime

app = FastAPI(title="AYUSYNC API")

# CORS - allow Next.js frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class NamasteCode(BaseModel):
    code: str
    display: str
    system: str
    category: str

class ICDCode(BaseModel):
    code: str
    display: str
    module: str

class ProblemCreate(BaseModel):
    patientId: str
    namasteCode: str
    icdCodes: List[str]

# Mock data - replace with Firestore later
mock_namaste_data = [
    {"code": "NAM-001", "display": "Vata Dosha Imbalance", "system": "urn:namaste", "category": "Dosha"},
    {"code": "NAM-002", "display": "Pitta Aggravation", "system": "urn:namaste", "category": "Dosha"},
    {"code": "NAM-003", "display": "Kapha Excess", "system": "urn:namaste", "category": "Dosha"},
]

mock_icd_data = [
    {"code": "TM2.A01.1", "display": "Traditional Medicine - Vata Disorder", "module": "TM2"},
    {"code": "TM2.B05.2", "display": "Traditional Medicine - Pitta Disorder", "module": "TM2"},
    {"code": "DA02.1", "display": "Functional bowel disorder", "module": "Biomedical"},
]

# API Endpoints
@app.get("/")
async def root():
    return {"message": "AYUSYNC API is running"}

@app.get("/api/namaste/search")
async def search_namaste(q: str = ""):
    """Search NAMASTE codes"""
    if not q:
        return mock_namaste_data
    
    results = [item for item in mock_namaste_data 
              if q.lower() in item["display"].lower() or q.lower() in item["code"].lower()]
    return results

@app.get("/api/icd/search")
async def search_icd(q: str = ""):
    """Search ICD-11 codes"""
    if not q:
        return mock_icd_data
    
    results = [item for item in mock_icd_data 
              if q.lower() in item["display"].lower() or q.lower() in item["code"].lower()]
    return results

@app.post("/api/problem-list")
async def create_problem(problem: ProblemCreate):
    """Save dual-coded problem"""
    # Here you would save to Firestore
    print(f"Saving problem: {problem}")
    
    # Simulate FHIR Condition resource creation
    fhir_condition = {
        "resourceType": "Condition",
        "code": {
            "coding": [
                {
                    "system": "urn:namaste",
                    "code": problem.namasteCode,
                    "display": next((item["display"] for item in mock_namaste_data if item["code"] == problem.namasteCode), "")
                }
            ] + [
                {
                    "system": "http://who.int/icd11",
                    "code": icd_code,
                    "display": next((item["display"] for item in mock_icd_data if item["code"] == icd_code), "")
                }
                for icd_code in problem.icdCodes
            ]
        },
        "subject": {
            "reference": f"Patient/{problem.patientId}"
        }
    }
    
    return {
        "success": True,
        "message": "Problem saved successfully",
        "fhirCondition": fhir_condition
    }

@app.get("/api/logs/recent")
async def get_recent_logs():
    """Get recent API logs"""
    return [
        {"timestamp": datetime.now().isoformat(), "endpoint": "GET /api/namaste/search", "status": 200},
        {"timestamp": datetime.now().isoformat(), "endpoint": "GET /api/icd/search", "status": 200},
        {"timestamp": datetime.now().isoformat(), "endpoint": "POST /api/problem-list", "status": 201},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)