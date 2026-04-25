#!/usr/bin/env python3
"""Static code security analysis scanner."""

import os, re, sys, json, logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SECRET_PATTERNS = [
    ("SEC-001", "CRITICAL", "Hardcoded AWS Key", r"AKIA[0-9A-Z]{16}"),
    ("SEC-002", "CRITICAL", "Private Key", r"-----BEGIN (RSA |EC )?PRIVATE KEY-----"),
    ("SEC-003", "HIGH", "API Key/Token", r'(?i)(api[_-]?key|access[_-]?token)\s*[:=]\s*[\'"][A-Za-z0-9_\-]{16,}[\'"]'),
    ("SEC-004", "HIGH", "Hardcoded Password", r'(?i)(password|passwd)\s*[:=]\s*[\'"][^\'"]{4,}[\'"]'),
    ("SEC-005", "HIGH", "GitHub Token", r"gh[pousr]_[A-Za-z0-9_]{36,}"),
]

CODE_PATTERNS = [
    ("CODE-001", "HIGH", "eval() usage", r"\beval\s*\("),
    ("CODE-002", "HIGH", "SQL interpolation", r'(?i)(execute|query)\s*\(\s*f[\'"]'),
    ("CODE-003", "MEDIUM", "SSL verify disabled", r"verify\s*=\s*False"),
    ("CODE-004", "HIGH", "Shell injection risk", r"subprocess\.\w+\(.*shell\s*=\s*True"),
]

SCAN_EXTS = {".py",".js",".ts",".jsx",".tsx",".java",".go",".rb",".php",".sh",".yml",".yaml",".json",".env",".tf"}
SKIP_DIRS = {"node_modules",".git","__pycache__","venv",".venv","dist","build","vendor"}


def scan_file(path: str) -> List[Dict[str, Any]]:
    findings = []
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
    except Exception:
        return findings
    for num, line in enumerate(lines, 1):
        for pid, sev, desc, regex in SECRET_PATTERNS + CODE_PATTERNS:
            if re.search(regex, line):
                findings.append({"id": pid, "severity": sev, "description": desc, "file": path, "line": num, "match": line.strip()[:120]})
    return findings


def scan_directory(target: str) -> Dict[str, Any]:
    all_findings, scanned = [], 0
    for root, dirs, files in os.walk(target):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if Path(f).suffix.lower() not in SCAN_EXTS:
                continue
            fp = os.path.join(root, f)
            for finding in scan_file(fp):
                finding["file"] = os.path.relpath(finding["file"], target)
                all_findings.append(finding)
            scanned += 1
    sev_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    all_findings.sort(key=lambda x: sev_order.get(x["severity"], 99))
    by_sev = {}
    for f in all_findings:
        by_sev[f["severity"]] = by_sev.get(f["severity"], 0) + 1
    return {"findings": all_findings, "stats": {"files_scanned": scanned, "total_findings": len(all_findings), "by_severity": by_sev}, "timestamp": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python static_analysis.py <target_dir>")
        sys.exit(1)
    print(json.dumps(scan_directory(sys.argv[1]), indent=2))
