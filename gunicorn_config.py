import os
import sys

# Add the project root to Python path
sys.path.insert(0, '/opt/render/project/src')

# Gunicorn config variables
bind = "0.0.0.0:10000"
workers = 1
worker_class = "sync"
timeout = 120
keepalive = 5
threads = 1

# Custom headers
def post_fork(server, worker):
    # Set environment variables for the worker
    os.environ['DJANGO_SETTINGS_MODULE'] = 'hustlemap.settings'
    os.environ['PYTHONPATH'] = '/opt/render/project/src'

# Custom request handling
def on_starting(server):
    server.log.info("Starting Gunicorn with custom configuration")
    server.log.info(f"Python path: {sys.path}")

def when_ready(server):
    server.log.info("Gunicorn is ready to accept connections")

def on_exit(server):
    server.log.info("Gunicorn is shutting down") 