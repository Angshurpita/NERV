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
    print(json.dumps(audit_directory(sys.argv[1]), indent=2))
