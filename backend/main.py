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

@app.get("/")
def read_root():
    return {"status": "online", "service": "NERV-VIPER Execution Layer"}

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
