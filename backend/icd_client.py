import os, time, json, httpx
from db import get_conn

WHO_TOKEN = None
WHO_TOKEN_EXPIRES = 0

WHO_TOKEN_URL = os.getenv("WHO_TOKEN_URL", "")  # set if you have WHO OAuth token endpoint
WHO_CLIENT_ID = os.getenv("WHO_CLIENT_ID", "")
WHO_CLIENT_SECRET = os.getenv("WHO_CLIENT_SECRET")

# Simple token fetch (if you have WHO credentials). If not set, we skip live WHO calls.
async def get_who_token():
    global WHO_TOKEN, WHO_TOKEN_EXPIRES
    if WHO_CLIENT_ID == "" or WHO_CLIENT_SECRET == "":
        return None
    if WHO_TOKEN and time.time() < WHO_TOKEN_EXPIRES - 30:
        return WHO_TOKEN
    # NOTE: replace token endpoint path with real WHO docs endpoint
    async with httpx.AsyncClient() as client:
        r = await client.post(WHO_TOKEN_URL, data={
            "grant_type":"client_credentials",
            "client_id": WHO_CLIENT_ID,
            "client_secret": WHO_CLIENT_SECRET
        }, timeout=10)
        r.raise_for_status()
        data = r.json()
        WHO_TOKEN = data["access_token"]
        WHO_TOKEN_EXPIRES = time.time() + int(data.get("expires_in", 3600))
        return WHO_TOKEN

async def search_who_icd(query: str, limit: int = 8):
    # If no WHO credentials, return empty list (we rely on local cache)
    token = await get_who_token()
    if not token:
        return []

    url = f"https://id.who.int/icd/release/11/mms/search?q={httpx.utils.quote(query)}&language=en"
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=headers, timeout=10)
        r.raise_for_status()
        payload = r.json()
        # parse response -> keep entity id and title
        results = []
        dest = payload.get("destinationEntities") or payload.get("destinationEntities",[])
        for ent in dest[:limit]:
            code = ent.get("id")
            title = ent.get("title",{}).get("value","")
            module = ent.get("chapter","") or "Biomed"
            results.append({"code": code, "display": title, "module": module, "raw": ent})
            # cache into DB
            cache_icd(code, title, module, ent)
        return results

def cache_icd(code, display, module, raw):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("INSERT OR REPLACE INTO icd_cache(code, display, module, raw_json, last_synced) VALUES (?,?,?,?,?)",
                (code, display, module, json.dumps(raw), int(time.time())))
    conn.commit()
    conn.close()

def search_cached_icd(query):
    # very simple: look for code or display LIKE
    conn = get_conn()
    cur = conn.cursor()
    qlike = f"%{query}%"
    cur.execute("SELECT code,display,module FROM icd_cache WHERE display LIKE ? OR code LIKE ? LIMIT 20", (qlike, qlike))
    rows = cur.fetchall()
    conn.close()
    return [{"code": r["code"], "display": r["display"], "module": r["module"]} for r in rows]