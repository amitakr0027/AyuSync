# db.py - UPDATED
import sqlite3
import json
from pathlib import Path
import time

DB_FILE = Path(__file__).parent / "ayusync.db"

def get_conn():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    
    # NAMASTE table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS namaste (
      code TEXT PRIMARY KEY,
      display TEXT,
      category TEXT,
      system TEXT DEFAULT 'urn:namaste'
    )""")
    
    # ConceptMap (NAMASTE -> ICD)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS concept_map (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      namaste_code TEXT,
      icd_code TEXT,
      icd_display TEXT,
      module TEXT,
      confidence INTEGER,
      mapping_type TEXT,
      UNIQUE(namaste_code, icd_code),
      FOREIGN KEY (namaste_code) REFERENCES namaste (code)
    )""")
    
    # ICD Cache
    cur.execute("""
    CREATE TABLE IF NOT EXISTS icd_cache (
      code TEXT PRIMARY KEY,
      display TEXT,
      module TEXT,
      raw_json TEXT,
      last_synced INTEGER
    )""")
    
    # Problems (saved dual-coded entries)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT,
      namaste_code TEXT,
      icd_code TEXT,
      created_at INTEGER,
      FOREIGN KEY (namaste_code) REFERENCES namaste (code)
    )""")
    
    conn.commit()
    conn.close()

def seed_sample_data():
    conn = get_conn()
    cur = conn.cursor()

    # Clear existing data to avoid duplicates
    cur.execute("DELETE FROM namaste")
    cur.execute("DELETE FROM concept_map")
    
    # Insert comprehensive NAMASTE sample data
    namaste_samples = [
        ("NAM-001", "Vata Dosha Imbalance", "Dosha"),
        ("NAM-002", "Pitta Disorder", "Dosha"),
        ("NAM-003", "Kapha Excess", "Dosha"),
        ("NAM-004", "Madhumeha (Diabetes)", "Metabolic"),
        ("NAM-005", "Kustha (Skin Disorder)", "Dermatology"),
        ("NAM-006", "Pratishyaya (Rhinitis)", "Respiratory"),
        ("NAM-007", "Grahani (Irritable Bowel)", "Gastrointestinal"),
        ("NAM-008", "Rajayakshma (Tuberculosis)", "Respiratory"),
        ("NAM-009", "Arsha (Hemorrhoids)", "Gastrointestinal"),
        ("NAM-010", "Hridroga (Heart Disease)", "Cardiac"),
    ]
    
    for code, display, category in namaste_samples:
        cur.execute(
            "INSERT OR REPLACE INTO namaste(code, display, category) VALUES (?, ?, ?)",
            (code, display, category)
        )

    # Seed comprehensive concept mappings
    concept_mappings = [
        # Vata mappings
        ("NAM-001", "TM2.A01.1Z", "Traditional Medicine - Vata Disorder", "TM2", 95, "automatic"),
        ("NAM-001", "K59.1", "Functional diarrhea", "Biomedical", 85, "automatic"),
        
        # Pitta mappings
        ("NAM-002", "TM2.B05.2", "Traditional Medicine - Pitta Disorder", "TM2", 90, "automatic"),
        ("NAM-002", "L20.9", "Atopic dermatitis, unspecified", "Biomedical", 80, "automatic"),
        ("NAM-002", "K29.70", "Gastritis, unspecified", "Biomedical", 75, "automatic"),
        
        # Kapha mappings
        ("NAM-003", "TM2.C08.3", "Traditional Medicine - Kapha Disorder", "TM2", 90, "automatic"),
        ("NAM-003", "J40", "Bronchitis, not specified as acute or chronic", "Biomedical", 80, "automatic"),
        
        # Diabetes mappings
        ("NAM-004", "5A10", "Type 1 diabetes mellitus", "Biomedical", 95, "automatic"),
        ("NAM-004", "5A11", "Type 2 diabetes mellitus", "Biomedical", 90, "automatic"),
        
        # Skin disorder mappings
        ("NAM-005", "L20.9", "Atopic dermatitis, unspecified", "Biomedical", 85, "automatic"),
        ("NAM-005", "L40.9", "Psoriasis, unspecified", "Biomedical", 80, "automatic"),
        
        # Respiratory mappings
        ("NAM-006", "CA20.0", "Acute sinusitis", "Biomedical", 85, "automatic"),
        ("NAM-006", "CA20.1", "Chronic sinusitis", "Biomedical", 80, "automatic"),
        
        # Gastrointestinal mappings
        ("NAM-007", "K58.0", "Irritable bowel syndrome with diarrhea", "Biomedical", 90, "automatic"),
        ("NAM-007", "K58.9", "Irritable bowel syndrome without diarrhea", "Biomedical", 85, "automatic"),
        
        # Tuberculosis mapping
        ("NAM-008", "1B10", "Tuberculosis", "Biomedical", 95, "automatic"),
        
        # Hemorrhoids mapping
        ("NAM-009", "KB60.0", "Internal hemorrhoids", "Biomedical", 90, "automatic"),
        
        # Heart disease mapping
        ("NAM-010", "BA70", "Hypertensive heart disease", "Biomedical", 85, "automatic"),
    ]
    
    for mapping in concept_mappings:
        cur.execute(
            """INSERT OR REPLACE INTO concept_map 
               (namaste_code, icd_code, icd_display, module, confidence, mapping_type) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            mapping
        )
    
    conn.commit()
    conn.close()
    print("Database seeded with comprehensive mapping data")

if __name__ == "__main__":
    init_db()
    seed_sample_data()
    print("DB initialized and seeded.")