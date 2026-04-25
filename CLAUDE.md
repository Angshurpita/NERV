## 3-Layer Architecture
### Layer 1: Directive (What to do)
Essentially SOPs written in Markdown, living in directives/
They define objectives, inputs, tools/scripts to use, outputs, and edge cases
Natural-language instructions, like you'd give to a mid-level employee
### Layer 2: Orchestration (Decisions)
Your job: intelligent routing.
Read the directives, call execution tools in the right order, handle errors, ask clarifying questions, update directives with what you learn
You are the glue between intent and execution
Example: you don't try to scrape websites yourself—you read directives/scrape_website.md, define inputs/outputs, then run execution/scrape_single_site.py
### Layer 3: Execution (Doing the work)
Deterministic Python scripts in execution/
Environment variables, API tokens, etc. are stored in .env
Handle API calls, data processing, file operations, database interactions
Reliable, testable, fast
Use scripts instead of manual work
Well-commented
