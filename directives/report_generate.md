# Directive: Report Generation

> Version: 1.0.0
> Last Updated: 2026-04-25
> Status: active

## Objective

Synthesize raw analysis data into a structured, human-readable security report.
The report follows the NERV-VIPER standardized format with severity classification,
root-cause analysis, and actionable remediation steps.

## Inputs

| Parameter         | Type     | Required | Description                                  |
|-------------------|----------|----------|----------------------------------------------|
| `scan_results`    | JSON     | yes      | Raw findings from the security scan pipeline |
| `output_format`   | string   | no       | `pdf`, `markdown`, or `html` (default: `markdown`) |
| `include_summary` | boolean  | no       | Include executive summary (default: `true`)  |

## Execution Scripts

| Script                            | Purpose                                  |
|-----------------------------------|------------------------------------------|
| `execution/generate_report.py`    | Core report generation engine            |
| `execution/utils/formatters.py`   | Output formatting utilities              |

## Procedure

1. **Parse** — Load and validate the scan results JSON
2. **Classify** — Categorize findings by severity (Critical / High / Medium / Low / Info)
3. **Analyze** — Perform root-cause grouping to consolidate related findings
4. **Format** — Render the report in the requested output format
5. **Export** — Write the report to the output directory

## Outputs

| Output              | Format      | Description                               |
|---------------------|-------------|-------------------------------------------|
| `report_file`       | PDF/MD/HTML | The final formatted security report       |
| `report_metadata`   | JSON        | Metadata: timestamp, scan ID, statistics  |

## Edge Cases

| Scenario                  | Handling Strategy                            |
|---------------------------|----------------------------------------------|
| Empty scan results        | Generate "clean" report with zero findings   |
| Invalid JSON input        | Return validation error with schema guidance |
| Report generation timeout | Save partial report, log warning             |

## Notes

- Reports must never include auto-fix suggestions in the output
- All findings must trace back to a root cause
- PDF generation requires `weasyprint` or equivalent in the execution layer
