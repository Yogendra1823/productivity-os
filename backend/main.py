from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = FastAPI()

# --- SECURITY & CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI CONFIGURATION ---
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# --- IN-MEMORY DATABASE ---
db = {
    "tasks": [],
    "notes": [],
    "schedule": []
}

class Query(BaseModel):
    user_input: str

# --- GOOGLE CALENDAR HELPER (SERVICE ACCOUNT) ---
def create_calendar_event(summary: str):
    # This must match the calendar you shared with the bot
    MY_CALENDAR_ID = 'medarametlayogendra@gmail.com' 
    
    if not os.path.exists('service_account.json'):
        return "Error: service_account.json missing. Cannot access calendar."
    
    try:
        # Authenticate as the bot
        creds = service_account.Credentials.from_service_account_file(
            'service_account.json', 
            scopes=['https://www.googleapis.com/auth/calendar.events']
        )
        service = build('calendar', 'v3', credentials=creds)

        # Schedule 1 hour from now for the MVP
        start_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        end_time = start_time + datetime.timedelta(hours=1)

        event = {
            'summary': summary,
            'start': {'dateTime': start_time.isoformat() + 'Z', 'timeZone': 'UTC'},
            'end': {'dateTime': end_time.isoformat() + 'Z', 'timeZone': 'UTC'},
        }

        event_result = service.events().insert(calendarId=MY_CALENDAR_ID, body=event).execute()
        return f"Event created! Link: {event_result.get('htmlLink')}"
    
    except Exception as e:
        return f"Calendar API Error: {str(e)}"

@app.get("/")
def health_check():
    return {"status": "Productivity OS Backend is Live 🚀"}

@app.post("/query")
def orchestrator(q: Query):
    prompt = f"""
    You are an elite AI Productivity Orchestrator.
    User request: "{q.user_input}"
    
    Categorize this request into exactly ONE of these agents: [TASK, NOTE, SCHEDULE, GENERAL].
    Then, provide a brief, actionable response.
    
    Format your response EXACTLY like this:
    AGENT: <category>
    RESPONSE: <your response>
    """
    
    try:
        response = model.generate_content(prompt).text.strip()
        
        # Simple routing logic based on AI output
        if "AGENT: TASK" in response:
            db["tasks"].append(q.user_input)
        elif "AGENT: NOTE" in response:
            db["notes"].append(q.user_input)
        elif "AGENT: SCHEDULE" in response:
            db["schedule"].append(q.user_input)
            # ✨ CALL THE CALENDAR API ✨
            cal_result = create_calendar_event(q.user_input)
            response += f"\n\n[Live Action] {cal_result}"
            
        return {"reply": response, "state": db}
    except Exception as e:
        return {"reply": f"System Error: {str(e)}", "state": db}

# --- STATE ENDPOINT ---
@app.get("/state")
def get_state():
    return db