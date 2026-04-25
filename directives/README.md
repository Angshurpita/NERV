# Directives Layer

> **Layer 1 — What to do**

This directory contains Standard Operating Procedures (SOPs) written in Markdown.
Each directive defines:

- **Objective** — What the task aims to accomplish
- **Inputs** — Required data, parameters, or context
- **Tools/Scripts** — Which execution scripts to invoke
- **Outputs** — Expected deliverables or results
- **Edge Cases** — Known failure modes and how to handle them

## Writing Directives

Think of each directive as instructions you'd give to a mid-level employee:
clear, actionable, and complete. The orchestration layer reads these to
determine execution flow.

## Naming Convention

```
directives/
├── <domain>_<action>.md      # e.g., security_scan.md
├── <domain>_<action>.md      # e.g., report_generate.md
└── README.md                 # This file
```

## Template

Use `_template.md` as the starting point for all new directives.
