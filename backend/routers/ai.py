import os
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, auth, models, crud

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")    
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@router.get("/summary")
def get_weekly_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    api_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        return {"summary": "Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables to enable AI summaries."}
    
    genai.configure(api_key=api_key)

    tasks = crud.get_tasks(db, user_id=current_user.id)
    
    if not tasks:
        return {"summary": "You have no tasks yet. Create some tasks to get an AI-powered weekly summary!"}

    task_list_text = "\n".join([f"- {task.title} (Status: {task.status}, Priority: {task.priority})" for task in tasks])
    
    prompt = f"""
    You are a helpful productivity assistant. 
    Here is a list of my tasks for the week:
    {task_list_text}
    
    Please provide a concise summary of my workload, identify any high-priority items I should focus on, and give me a motivational tip for the week.
    
    Rules:
    1. Do NOT use conversational fillers like "Okay, here is..." or "Sure!".
    2. Start directly with the summary content.
    3. Use bolding for key terms (e.g., **Workload Summary:**).
    4. Keep the response under 150 words.w
    """

    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        print(f"Error generating AI summary: {e}")
        return {"summary": f"Unable to generate summary. Error: {str(e)}"}
