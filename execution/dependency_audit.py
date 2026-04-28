#!/usr/bin/env python3
"""Dependency audit — checks manifests against known CVE patterns."""

import os, sys, json, logging, subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

MANIFEST_FILES = {
    "package.json": "npm",
    "requirements.txt": "pip",
    "Pipfile.lock": "pipenv",
    "poetry.lock": "poetry",
    "go.sum": "go",
    "Gemfile.lock": "bundler",
    "Cargo.lock": "cargo",
    "composer.lock": "composer",
}


def detect_manifests(target_dir: str) -> list:
    found = []
    for root, _, files in os.walk(target_dir):
        if ".git" in root or "node_modules" in root:
            continue
        for f in files:
            if f in MANIFEST_FILES:
                found.append({"file": os.path.relpath(os.path.join(root, f), target_dir), "ecosystem": MANIFEST_FILES[f]})
    return found


def sanitize_target_dir(raw_dir: str) -> str:
    """Resolve and validate the target directory against an allowed workspace root."""
    target_dir = os.path.abspath(raw_dir)
    # Hardcoded secure workspace root — adjust to your deployment's workspace path
    allowed_root = os.path.abspath(os.environ.get("NERV_WORKSPACE_ROOT", "/tmp/nerv-workspaces"))
    if not target_dir.startswith(allowed_root + os.sep) and target_dir != allowed_root:
        raise ValueError(f"Directory traversal blocked: {raw_dir} resolves outside allowed workspace")
    return target_dir


def run_npm_audit(target_dir: str) -> dict:
    pkg = os.path.join(target_dir, "package.json")
    if not os.path.exists(pkg):
        return {"skipped": True, "reason": "No package.json"}
    try:
        result = subprocess.run(["npm", "audit", "--json"], capture_output=True, text=True, cwd=target_dir, timeout=60)
        return json.loads(result.stdout) if result.stdout.strip() else {"error": "Empty output"}
    except Exception as e:
        return {"error": str(e)}


def audit_directory(target_dir: str) -> Dict[str, Any]:
    manifests = detect_manifests(target_dir)
    npm_result = run_npm_audit(target_dir) if any(m["ecosystem"] == "npm" for m in manifests) else None
    return {
        "manifests_found": manifests,
        "npm_audit": npm_result,
        "stats": {"manifests_detected": len(manifests), "ecosystems": list({m["ecosystem"] for m in manifests})},
        "timestamp": datetime.utcnow().isoformat(),
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python dependency_audit.py <target_dir>")
        sys.exit(1)
    try:
        safe_dir = sanitize_target_dir(sys.argv[1])
    except ValueError as e:
        logger.error(str(e))
        sys.exit(1)
    print(json.dumps(audit_directory(safe_dir), indent=2))
