import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Executes a command using spawn (no shell) and returns stdout/stderr.
 * This avoids shell injection by passing arguments as an array.
 */
function spawnAsync(command: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: false });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}: ${stderr}`));
      } else {
        resolve({ stdout, stderr });
      }
    });

    child.on('error', reject);
  });
}

/**
 * Validates that a resolved path is within the allowed base directory.
 * Prevents path traversal attacks (../ sequences).
 */
function validatePath(filePath: string, allowedBase: string): string {
  const resolved = path.resolve(filePath);
  const resolvedBase = path.resolve(allowedBase);
  if (!resolved.startsWith(resolvedBase + path.sep) && resolved !== resolvedBase) {
    throw new Error('Path traversal detected: access denied');
  }
  return resolved;
}

export async function GET() {
  try {
    const tmpDir = os.tmpdir();

    // Use basename-only filenames to prevent traversal — these are hardcoded, not user-controlled
    const scanJsonFilename = 'nerv_mock_scan_results.json';
    const outputMdFilename = 'nerv_mock_security_report.md';

    const scanJsonPath = validatePath(path.join(tmpDir, scanJsonFilename), tmpDir);
    const outputMdPath = validatePath(path.join(tmpDir, outputMdFilename), tmpDir);

    // Create a mock scan results file for the python script
    const mockScanData = {
      stats: {
        total_findings: 3,
        files_scanned: 15,
        by_severity: { CRITICAL: 1, HIGH: 1, MEDIUM: 1, LOW: 0 }
      },
      findings: [
        { severity: 'CRITICAL', description: 'Hardcoded credentials', id: 'VULN-01', file: 'src/auth.ts', line: 42, match: 'password = "********"' },
        { severity: 'HIGH', description: 'SQL Injection vector', id: 'VULN-02', file: 'src/db.ts', line: 15, match: 'SELECT * FROM users WHERE id = ' },
        { severity: 'MEDIUM', description: 'Missing rate limit', id: 'VULN-03', file: 'src/api.ts', line: 8, match: 'app.post("/login")' }
      ]
    };
    fs.writeFileSync(scanJsonPath, JSON.stringify(mockScanData));

    // Path to the python script — hardcoded, never user-influenced
    const scriptPath = path.resolve(process.cwd(), '..', 'execution', 'generate_report.py');

    // Validate the script path exists within the expected workspace
    const secureExecutionDir = path.resolve(process.cwd(), '..', 'execution');
    if (!scriptPath.startsWith(secureExecutionDir + path.sep) && scriptPath !== path.join(secureExecutionDir, 'generate_report.py')) {
      throw new Error("Invalid script path");
    }

    // FIX G002: Use spawn with args array instead of exec with string interpolation
    // This prevents command injection by bypassing the shell entirely
    const { stdout, stderr } = await spawnAsync('python3', [
      scriptPath,
      scanJsonPath,
      '',        // dep_json_path (empty)
      outputMdPath
    ]);

    // Read the generated markdown
    let reportMarkdown = "No report generated.";
    if (fs.existsSync(outputMdPath)) {
      reportMarkdown = fs.readFileSync(outputMdPath, 'utf8');
    }

    return NextResponse.json({
      success: true,
      report: reportMarkdown,
      stats: mockScanData.stats
    });
  } catch (error: any) {
    console.error('Telemetry error:', error);
    return NextResponse.json({ success: false, error: 'Internal telemetry error' }, { status: 500 });
  }
}
