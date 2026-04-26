import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Add the project root to sys.path so we can import the execution layer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from execution.clone_repository import clone_repository, cleanup_workspace
from execution.static_analysis import scan_directory
from execution.dependency_audit import audit_directory

app = FastAPI(title="NERV-VIPER Backend API")

class ScanRequest(BaseModel):
    target_url: str
    scan_depth: Optional[str] = "deep"

from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NERV-VIPER Backend API</title>
        <style>
            body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                background-color: #f8fafc;
                color: #0f172a;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background: white;
                padding: 3rem;
                border-radius: 1.5rem;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                border: 1px solid #e2e8f0;
                text-align: center;
                max-width: 600px;
                width: 90%;
            }
            h1 {
                font-size: 2.5rem;
                font-weight: 800;
                letter-spacing: -0.025em;
                margin-bottom: 0.5rem;
                color: #1e293b;
            }
            h1 span {
                color: #2563eb;
            }
            p {
                color: #64748b;
                font-size: 1.125rem;
                margin-bottom: 2rem;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: #dcfce7;
                color: #166534;
                padding: 0.5rem 1rem;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.875rem;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            .links {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            a {
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s;
            }
            a:hover {
                color: #1d4ed8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>NERV<span>-VIPER</span></h1>
            <p>Execution Layer & Backend Services</p>
            <div class="status-badge">
                <div class="status-dot"></div>
                SYSTEM ONLINE
            </div>
            <div class="links">
                <a href="/docs">API Documentation</a>
                <a href="https://nerv-sand.vercel.app">Return to App</a>
            </div>
        </div>
    </body>
    </html>
    """

@app.post("/scan")
async def run_scan(request: ScanRequest):
    # 1. Clone
    clone_result = clone_repository(request.target_url)
    if not clone_result["success"]:
        raise HTTPException(status_code=400, detail=clone_result["error"])
    
    workspace_path = clone_result["path"]
    
    try:
        # 2. Static Analysis
        static_results = scan_directory(workspace_path)
        
        # 3. Dependency Audit
        dependency_results = audit_directory(workspace_path)
        
        # 4. Synthesize
        final_report = {
            "target": request.target_url,
            "repo_name": clone_result["repo_name"],
            "static_analysis": static_results,
            "dependency_audit": dependency_results,
            "timestamp": clone_result["timestamp"]
        }
        
        return final_report
        
    finally:
        # Cleanup
        cleanup_workspace(os.path.dirname(workspace_path))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
