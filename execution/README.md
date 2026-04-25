# Execution Layer

> **Layer 3 — Doing the work**

Deterministic Python scripts that handle API calls, data processing,
file operations, and database interactions.

## Scripts

| Script                  | Purpose                                    |
|-------------------------|--------------------------------------------|
| `clone_repository.py`   | Clone target repos to isolated workspace   |
| `static_analysis.py`    | Pattern-based static code analysis         |
| `dependency_audit.py`   | Audit dependencies for known CVEs          |
| `generate_report.py`    | Synthesize findings into reports           |

## Design Principles

- **Reliable** — Handle errors gracefully, never crash silently
- **Testable** — Pure functions, clear inputs/outputs, JSON contracts
- **Fast** — Minimize I/O, skip irrelevant files early
- **Well-commented** — Every script documents its directive reference

## Environment

All environment variables, API tokens, and secrets are stored in `.env`
(see `.env.example` at project root). Scripts load config via `os.environ`
or `python-dotenv`.
