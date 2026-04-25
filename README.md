# NERV-VIPER Web

> Multi-agent security orchestration framework built on a 3-layer architecture.

## Architecture

```
┌──────────────────────────────────────────────────┐
│                 Layer 1: DIRECTIVE                │
│          (SOPs in Markdown — directives/)         │
│   Defines objectives, inputs, tools, outputs     │
├──────────────────────────────────────────────────┤
│               Layer 2: ORCHESTRATION              │
│            (AI — intelligent routing)             │
│   Reads directives, calls execution, handles     │
│   errors, asks clarifying questions              │
├──────────────────────────────────────────────────┤
│                Layer 3: EXECUTION                 │
│        (Python scripts — execution/)              │
│   API calls, data processing, file ops           │
│   Reliable • Testable • Fast • Well-commented    │
└──────────────────────────────────────────────────┘
```

## Project Structure

```
Nerv Web/
├── CLAUDE.md               # Architecture specification
├── README.md               # This file
├── .env.example            # Environment variable template
├── .gitignore
├── directives/             # Layer 1 — SOPs
│   ├── README.md
│   ├── _template.md        # Directive template
│   ├── security_scan.md    # Security scan pipeline
│   └── report_generate.md  # Report generation
└── execution/              # Layer 3 — Scripts
    ├── __init__.py
    ├── README.md
    ├── clone_repository.py
    ├── static_analysis.py
    ├── dependency_audit.py
    └── generate_report.py
```

## Quick Start

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 2. Run a security scan
python execution/clone_repository.py https://github.com/user/repo

# 3. Run static analysis on the cloned repo
python execution/static_analysis.py /tmp/nerv_scan_*/repo_name

# 4. Generate a report
python execution/generate_report.py scan_results.json
```

## Deployment Architecture

The NERV-VIPER framework is designed for multi-platform high availability:

- **Frontend**: [Vercel](https://vercel.com) (Next.js)
  - Hosted at: `nerv777.vercel.app` (or custom domain)
  - Manages identity (Supabase), routing, and UI.
- **Backend**: [Render](https://render.com) (FastAPI + Execution Layer)
  - Hosted at: `nerv-viper-backend.onrender.com`
  - Handles heavy lifting: cloning, static analysis, and security audits.

## Layer Details

### Layer 1: Directives
Natural-language SOPs that define *what* to do. See `directives/README.md`.

### Layer 2: Orchestration
The AI layer (you) that reads directives, routes to execution scripts,
handles errors, and updates directives with lessons learned.

### Layer 3: Execution
Deterministic Python scripts that do the actual work. See `execution/README.md`.

## License

MIT
