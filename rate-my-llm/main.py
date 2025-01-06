# main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import evaluate
import nltk
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],               
    allow_headers=["*"],             
)

class EvaluationRequest(BaseModel):
    system_prompt: str
    user_input: str
    model_response: str


bleu = evaluate.load("bleu")
rouge = evaluate.load("rouge")

@app.post("/evaluate")
def evaluate_endpoint(request: EvaluationRequest):
    try:
        logger.info("Received evaluation request")
        
      
        reference = request.user_input
 
        hypothesis = request.model_response


        bleu_score = bleu.compute(predictions=[hypothesis], references=[[reference]])

        
        rouge_score = rouge.compute(predictions=[hypothesis], references=[reference])


        scores = {
            "bleu": bleu_score,
            "rouge": rouge_score
        }

        logger.info(f"Evaluation scores: {scores}")
        return {"score": scores}
    except Exception as e:
        logger.error(f"Error during evaluation: {e}")
        raise HTTPException(status_code=500, detail=str(e))
