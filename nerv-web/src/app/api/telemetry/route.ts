import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const tmpDir = os.tmpdir();
    const scanJsonPath = path.join(tmpDir, 'mock_scan_results.json');
    const outputMdPath = path.join(tmpDir, 'mock_security_report.md');

    // Create a mock scan results file for the python script
    const mockScanData = {
      stats: {
        total_findings: 3,
        files_scanned: 15,
        by_severity: { CRITICAL: 1, HIGH: 1, MEDIUM: 1, LOW: 0 }
      },
      findings: [
        { severity: 'CRITICAL', description: 'Hardcoded credentials', id: 'VULN-01', file: 'src/auth.ts', line: 42, match: 'password = "secret"' },
        { severity: 'HIGH', description: 'SQL Injection vector', id: 'VULN-02', file: 'src/db.ts', line: 15, match: 'SELECT * FROM users WHERE id = ' },
        { severity: 'MEDIUM', description: 'Missing rate limit', id: 'VULN-03', file: 'src/api.ts', line: 8, match: 'app.post("/login")' }
      ]
    };
    fs.writeFileSync(scanJsonPath, JSON.stringify(mockScanData));

    // Path to the python script
    // Resolve assuming the execution folder is adjacent to nerv-web in the workspace
    const scriptPath = path.join(process.cwd(), '..', 'execution', 'generate_report.py');

    // Run the script
    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}" "${scanJsonPath}" "" "${outputMdPath}"`);
    
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
