from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_headers=['*'],
    allow_methods=['GET'],
    allow_origins=['http://localhost:3000'],
)

# Load dummy data
try:
    with open("dummyData.json", "r") as f:
        DUMMY_DATA = json.load(f)
        DUMMY_SALES_DATA = DUMMY_DATA.get('salesReps', [])
except Exception as e:
    DUMMY_DATA = []
    DUMMY_SALES_DATA = []

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
    
    # Placeholder logic: echo the question or generate a simple response
    # Replace with real AI logic as desired (e.g., call to an LLM).
    return {"answer": f"This is a placeholder answer to your question: {user_question}"}

@app.get("/api/sales-reps")
def get_sales_data():
    """
    Returns sales reps dummy data
    """
    return DUMMY_SALES_DATA

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
