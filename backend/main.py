from dotenv import load_dotenv
from google import genai
from google.genai import types
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import uvicorn


# load .env
load_dotenv()
GEMINI_AI_KEY = os.getenv("GEMINI_AI_KEY", "")

# Load dummy data
try:
    with open("dummyData.json", "r") as f:
        DUMMY_DATA = json.load(f)
        DUMMY_SALES_DATA = DUMMY_DATA.get('salesReps', [])
except Exception as e:
    DUMMY_DATA = []
    DUMMY_SALES_DATA = []

ai_client = genai.Client(api_key=GEMINI_AI_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_headers=['*'],
    allow_methods=['GET', 'POST'],
    allow_origins=['http://localhost:3000'],
)

@app.get("/api/data")
def get_data():
    """
    Returns dummy data (e.g., list of users).
    """
    return DUMMY_DATA

@app.post("/api/ai")
async def ai_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.
    (Optionally integrate a real AI model or external service here.)
    """
    body = await request.json()
    user_question = body.get("question", "")
    
    if not user_question:
        return {"answer": "Please provide question"}    

    response = ai_client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction="You are an expert sales data analyzer." +
              f"Your job is to answer the user's query based on this JSON data: {json.dumps(DUMMY_SALES_DATA)}"
        ),
        contents=[user_question]
    )

    return {"answer": f"{response.text}"}

@app.get("/api/sales-reps")
def get_sales_data():
    """
    Returns sales reps dummy data
    """
    return DUMMY_SALES_DATA

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
