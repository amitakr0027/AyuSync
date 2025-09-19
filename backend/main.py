# backend/main.py

import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3
import time

# Local modules
from db import get_conn, init_db, seed_sample_data
from icd_client import search_who_icd, search_cached_icd, cache_icd

# --------------------------------------------------
# App setup
# --------------------------------------------------
app = FastAPI(title="AYUSYNC API")

# Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
def startup():
    init_db()
    seed_sample_data()

# --------------------------------------------------
# Data Models
# --------------------------------------------------
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

class ProblemIn(BaseModel):
    patientId: str
    namasteCode: str
    icdCode: str

class MappingSuggestion(BaseModel):
    code: str
    display: str
    module: str
    confidence: int
    mappingType: str

# --------------------------------------------------
# Endpoints
# --------------------------------------------------
@app.get("/")
async def root():
    return {"message": "AYUSYNC API is running"}

# ------------------- NAMASTE search -------------------
@app.get("/api/namaste/search")
async def search_namaste(q: str = ""):
    """Search NAMASTE codes from database"""
    conn = get_conn()
    cur = conn.cursor()
    
    if not q:
        cur.execute("SELECT code, display, category FROM namaste LIMIT 50")
    else:
        qlike = f"%{q}%"
        cur.execute(
            "SELECT code, display, category FROM namaste WHERE display LIKE ? OR code LIKE ? LIMIT 50", 
            (qlike, qlike)
        )
    
    rows = cur.fetchall()
    conn.close()
    
    return [
        {
            "code": r["code"],
            "display": r["display"], 
            "category": r["category"],
            "system": "urn:namaste"
        } for r in rows
    ]

# ------------------- ICD search -------------------
@app.get("/api/icd/search")
async def search_icd(q: str = ""):
    """Search ICD codes with WHO API fallback to cache"""
    if not q:
        # Return some default results
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT code, display, module FROM icd_cache LIMIT 10")
        rows = cur.fetchall()
        conn.close()
        return [dict(r) for r in rows]
    
    try:
        # Try WHO API first
        results = await search_who_icd(q, limit=10)
        if results:
            return results
    except Exception as e:
        print("WHO search failed:", e)
    
    # Fallback to cache
    return search_cached_icd(q)

# ------------------- Mapping -------------------
@app.get("/api/concept-map/{namaste_code}")
async def get_concept_map(namaste_code: str):
    """Get ICD-11 mappings for a NAMASTE code from database"""
    conn = get_conn()
    cur = conn.cursor()
    
    # Check if NAMASTE code exists
    cur.execute("SELECT code FROM namaste WHERE code = ?", (namaste_code,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="NAMASTE code not found")
    
    # Get mappings from concept_map table
    cur.execute(
        """SELECT icd_code, icd_display, module, confidence, mapping_type 
           FROM concept_map WHERE namaste_code = ? ORDER BY confidence DESC""",
        (namaste_code,)
    )
    rows = cur.fetchall()
    conn.close()
    
    if not rows:
        return []
    
    return [
        {
            "code": r["icd_code"],
            "display": r["icd_display"],
            "module": r["module"],
            "confidence": r["confidence"],
            "mappingType": r["mapping_type"]
        } for r in rows
    ]

# ------------------- Problems -------------------
@app.post("/api/problem-list")
async def create_problem(problem: ProblemCreate):
    """Save dual-coded problem to database"""
    conn = get_conn()
    cur = conn.cursor()
    
    # Verify NAMASTE code exists
    cur.execute("SELECT code FROM namaste WHERE code = ?", (problem.namasteCode,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="NAMASTE code not found")
    
    # Save each ICD code mapping
    for icd_code in problem.icdCodes:
        cur.execute(
            """INSERT INTO problems (patient_id, namaste_code, icd_code, created_at) 
               VALUES (?, ?, ?, ?)""",
            (problem.patientId, problem.namasteCode, icd_code, int(time.time()))
        )
    
    conn.commit()
    
    # Get display names for response
    cur.execute("SELECT display FROM namaste WHERE code = ?", (problem.namasteCode,))
    namaste_display = cur.fetchone()["display"]
    
    icd_displays = []
    for icd_code in problem.icdCodes:
        # Try to get from cache first
        cur.execute("SELECT display FROM icd_cache WHERE code = ?", (icd_code,))
        cached = cur.fetchone()
        if cached:
            icd_displays.append(cached["display"])
        else:
            icd_displays.append(icd_code)
    
    conn.close()
    
    # Create FHIR-like response
    fhir_condition = {
        "resourceType": "Condition",
        "code": {
            "coding": [
                {
                    "system": "urn:namaste",
                    "code": problem.namasteCode,
                    "display": namaste_display
                }
            ] + [
                {
                    "system": "http://who.int/icd11",
                    "code": icd_code,
                    "display": display
                }
                for icd_code, display in zip(problem.icdCodes, icd_displays)
            ]
        },
        "subject": {"reference": f"Patient/{problem.patientId}"}
    }
    
    return {
        "success": True, 
        "message": "Problem saved successfully", 
        "fhirCondition": fhir_condition
    }

# ------------------- Logs -------------------
@app.get("/api/logs/recent")
async def get_recent_logs():
    return [
        {"timestamp": datetime.now().isoformat(), "endpoint": "GET /api/namaste/search", "status": 200},
        {"timestamp": datetime.now().isoformat(), "endpoint": "GET /api/icd/search", "status": 200},
        {"timestamp": datetime.now().isoformat(), "endpoint": "POST /api/problem-list", "status": 201},
    ]

# ------------------- Debug Endpoints (FIXED for your schema) -------------------
@app.get("/api/debug/problems")
async def debug_problems():
    """Debug endpoint to view saved problems - FIXED"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        
        # Get problems with namaste display names
        cur.execute("""
            SELECT p.*, n.display as namaste_display 
            FROM problems p
            LEFT JOIN namaste n ON p.namaste_code = n.code
            ORDER BY p.created_at DESC
        """)
        rows = cur.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        result = []
        for row in rows:
            result.append(dict(row))
        
        return result
        
    except Exception as e:
        print(f"Error in debug_problems: {e}")
        return {"error": str(e)}

@app.get("/api/debug/concept-map")
async def debug_concept_map():
    """Debug endpoint to view concept mappings - FIXED"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        
        # Get concept maps with namaste display names
        cur.execute("""
            SELECT cm.*, n.display as namaste_display 
            FROM concept_map cm 
            LEFT JOIN namaste n ON cm.namaste_code = n.code 
            ORDER BY cm.confidence DESC
        """)
        rows = cur.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        result = []
        for row in rows:
            result.append(dict(row))
        
        return result
        
    except Exception as e:
        print(f"Error in debug_concept_map: {e}")
        return {"error": str(e)}

@app.get("/api/debug/namaste")
async def debug_namaste():
    """Debug endpoint to view NAMASTE codes - FIXED"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        
        # Get all namaste codes
        cur.execute("SELECT * FROM namaste ORDER BY code")
        rows = cur.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        result = []
        for row in rows:
            result.append(dict(row))
        
        return result
        
    except Exception as e:
        print(f"Error in debug_namaste: {e}")
        return {"error": str(e)}

@app.get("/api/debug/icd-cache")
async def debug_icd_cache():
    """Debug endpoint to view ICD cache - NEW"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        
        # Get ICD cache
        cur.execute("SELECT code, display, module, last_synced FROM icd_cache ORDER BY last_synced DESC")
        rows = cur.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        result = []
        for row in rows:
            result.append(dict(row))
        
        return result
        
    except Exception as e:
        print(f"Error in debug_icd_cache: {e}")
        return {"error": str(e)}

# ------------------- Run -------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)