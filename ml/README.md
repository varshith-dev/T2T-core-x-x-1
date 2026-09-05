# ml

Python trash-classification service (FastAPI + gunicorn/uvicorn) and its ML pipelines.

```
ml/
  serving/     FastAPI app: POST /classify -> { category, confidence, modelVersion }
  training/    fine-tune a pre-trained model on reviewed photos (later; the flywheel)
  pipelines/   data prep, evaluation, nightly retrain job (low-traffic hours)
```

Approach: start with an existing pre-trained garbage classifier (Hugging Face) —
no training. Fine-tune on our own reviewed photos only when accuracy demands it.

Status: to be scaffolded next.
