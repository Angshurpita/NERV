#!/usr/bin/env python3
# ============================================================================
# clone_repository.py — Isolated Repository Cloning
# ============================================================================
# Clones a target repository into a temporary, isolated workspace.
# NEVER clones into the active project directory.
#
# Directive: directives/security_scan.md
# ============================================================================

import os
import sys
import json
import shutil
import logging
import tempfile
import subprocess
from pathlib import Path
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


def clone_repository(target_url: str, workspace_dir: str = None) -> dict:
    """
    Clone a git repository into an isolated workspace.

    Args:
        target_url: Git repository URL to clone.
        workspace_dir: Optional custom workspace path.
                       Defaults to a temp directory.

    Returns:
        dict with keys: success, path, repo_name, timestamp, error
    """
    result = {
        "success": False,
        "path": None,
        "repo_name": None,
        "timestamp": datetime.utcnow().isoformat(),
        "error": None,
    }

    # Derive repo name from URL
    repo_name = target_url.rstrip("/").split("/")[-1]
    if repo_name.endswith(".git"):
        repo_name = repo_name[:-4]
    result["repo_name"] = repo_name

    # Create isolated workspace
    if workspace_dir is None:
        workspace_dir = tempfile.mkdtemp(prefix="nerv_scan_")
    else:
        os.makedirs(workspace_dir, exist_ok=True)

    clone_path = os.path.join(workspace_dir, repo_name)

    # Safety check: never clone into the project directory
    project_root = str(Path(__file__).resolve().parent.parent)
    if os.path.commonpath([clone_path, project_root]) == project_root:
        result["error"] = (
            "BLOCKED: Clone target resolves inside the active project. "
            "Use an external directory."
        )
        logger.error(result["error"])
        return result

    try:
        logger.info(f"Cloning {target_url} -> {clone_path}")
        subprocess.run(
            ["git", "clone", "--depth", "1", target_url, clone_path],
            check=True,
            capture_output=True,
            text=True,
            timeout=120,
        )
        result["success"] = True
        result["path"] = clone_path
        logger.info(f"Clone complete: {clone_path}")

    except subprocess.TimeoutExpired:
        result["error"] = "Clone timed out after 120 seconds"
        logger.error(result["error"])
    except subprocess.CalledProcessError as e:
        result["error"] = f"Git clone failed: {e.stderr.strip()}"
        logger.error(result["error"])
    except Exception as e:
        result["error"] = f"Unexpected error: {str(e)}"
        logger.error(result["error"])

    return result


def cleanup_workspace(workspace_path: str) -> bool:
    """
    Remove a cloned workspace after analysis is complete.

    Args:
        workspace_path: Path to the workspace directory to remove.

    Returns:
        True if cleanup succeeded, False otherwise.
    """
    try:
        if os.path.exists(workspace_path):
            shutil.rmtree(workspace_path)
            logger.info(f"Cleaned up workspace: {workspace_path}")
            return True
        return False
    except Exception as e:
        logger.error(f"Cleanup failed: {str(e)}")
        return False


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python clone_repository.py <git_url> [workspace_dir]")
        sys.exit(1)

    url = sys.argv[1]
    ws_dir = sys.argv[2] if len(sys.argv) > 2 else None

    output = clone_repository(url, ws_dir)
    print(json.dumps(output, indent=2))

    sys.exit(0 if output["success"] else 1)
