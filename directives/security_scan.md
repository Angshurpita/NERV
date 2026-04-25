# Directive: Security Scan

> Version: 1.0.0
> Last Updated: 2026-04-25
> Status: active

## Objective

Perform a multi-layer security analysis on a target repository or codebase.
Identify vulnerabilities, misconfigurations, dependency risks, and systemic
weaknesses using the NERV-VIPER analysis pipeline.

## Inputs

| Parameter       | Type     | Required | Description                                    |
|-----------------|----------|----------|------------------------------------------------|
| `target_url`    | string   | yes      | Git repository URL or local path to scan       |
| `scan_depth`    | string   | no       | `shallow` or `deep` (default: `deep`)          |
| `output_format` | string   | no       | `json`, `pdf`, or `markdown` (default: `json`) |

## Execution Scripts

| Script                              | Purpose                                  |
|-------------------------------------|------------------------------------------|
| `execution/clone_repository.py`     | Clone target repo to isolated workspace  |
| `execution/static_analysis.py`      | Run static code analysis                 |
| `execution/dependency_audit.py`     | Audit dependencies for known CVEs        |
| `execution/generate_report.py`      | Synthesize findings into final report    |

## Procedure

1. **Clone** — Clone the target repository into an isolated temp directory
   (never into the active project workspace)
2. **Static Analysis** — Scan source files for security anti-patterns,
   hardcoded secrets, and unsafe code constructs
3. **Dependency Audit** — Check all dependency manifests against CVE databases
4. **Report Generation** — Aggregate all findings into a structured report
   with severity ratings and remediation guidance

## Outputs

| Output              | Format   | Description                                |
|---------------------|----------|--------------------------------------------|
| `scan_results`      | JSON     | Raw findings from all analysis stages      |
| `security_report`   | PDF/MD   | Human-readable report with recommendations |
| `risk_score`        | number   | Aggregate risk score (0-100)               |

## Edge Cases

| Scenario                       | Handling Strategy                              |
|--------------------------------|------------------------------------------------|
| Private repo (no access)       | Return auth error, prompt for credentials      |
| Empty repository               | Return empty scan with notice                  |
| Unsupported language           | Run generic file-level scan, note limitation   |
| Network failure during clone   | Retry 3x with backoff, then fail gracefully    |
| Target path is local project   | **Block execution** — never scan self in-place |

## Notes

- The scan must be **non-intrusive**: no modifications to the target repo
- Follows the "Root-Cause-First" mandate — report systemic issues, not symptoms
- Aligns with NERV-VIPER v3.5.6 analysis pipeline
