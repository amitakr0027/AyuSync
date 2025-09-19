# backend/check_schema.py
import sqlite3
from pathlib import Path

def check_schema():
    DB_FILE = Path(__file__).parent / "ayusync.db"
    
    print("🔍 Checking database schema...")
    
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        
        # Check problems table schema
        print("\n📋 Problems table schema:")
        cur.execute("PRAGMA table_info(problems)")
        for column in cur.fetchall():
            print(f"   {column[1]} ({column[2]})")
        
        # Check concept_map table schema  
        print("\n📋 Concept_map table schema:")
        cur.execute("PRAGMA table_info(concept_map)")
        for column in cur.fetchall():
            print(f"   {column[1]} ({column[2]})")
        
        # Check namaste table schema
        print("\n📋 Namaste table schema:")
        cur.execute("PRAGMA table_info(namaste)")
        for column in cur.fetchall():
            print(f"   {column[1]} ({column[2]})")
        
        # Check icd_cache table schema
        print("\n📋 ICD_cache table schema:")
        cur.execute("PRAGMA table_info(icd_cache)")
        for column in cur.fetchall():
            print(f"   {column[1]} ({column[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error checking schema: {e}")

if __name__ == "__main__":
    check_schema()