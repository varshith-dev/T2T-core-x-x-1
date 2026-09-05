# Production serving (Linux VM): gunicorn manages Uvicorn workers for the FastAPI app.
#   gunicorn serving.main:app -c gunicorn.conf.py
# Dev on Windows (gunicorn is Unix-only) uses uvicorn directly:
#   uv run uvicorn serving.main:app --port 8000
import os

bind = "0.0.0.0:8000"
worker_class = "uvicorn.workers.UvicornWorker"
# CPU inference: torch/ONNX already multi-thread internally, so keep workers LOW to
# avoid oversubscribing cores (too many workers x threads makes throughput worse).
workers = int(os.environ.get("WEB_CONCURRENCY", "2"))
timeout = 60
graceful_timeout = 30
