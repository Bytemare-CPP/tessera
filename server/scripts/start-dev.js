const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  node: '\x1b[36m%s\x1b[0m', // Cyan
  python: '\x1b[35m%s\x1b[0m', // Magenta
  system: '\x1b[33m%s\x1b[0m', // Yellow
  error: '\x1b[31m%s\x1b[0m', // Red
};

// Path to the vibe matcher directory
const vibeMatcherPath = path.join(__dirname, '..', 'src', 'services', 'vibe_matcher');

// Check if the Python service directory exists
if (!fs.existsSync(vibeMatcherPath)) {
  console.error(colors.error, '[SYSTEM] Vibe matcher directory not found:', vibeMatcherPath);
  process.exit(1);
}

// Start Node.js server
console.log(colors.system, '[SYSTEM] Starting Node.js server...');
const nodeServer = spawn('npm', ['run', 'dev:server'], { 
  stdio: 'pipe',
  shell: true
});

nodeServer.stdout.on('data', (data) => {
  console.log(colors.node, `[NODE] ${data.toString().trim()}`);
});

nodeServer.stderr.on('data', (data) => {
  console.error(colors.node, `[NODE ERROR] ${data.toString().trim()}`);
});

// Start Python Vibe Matcher service
console.log(colors.system, '[SYSTEM] Starting Python vibe matcher service...');

// Determine if we're in a virtual environment
const isWindows = process.platform === 'win32';
const pythonCommand = isWindows ? 'python' : 'python3';
const venvPath = path.join(vibeMatcherPath, 'venv');
const venvBinDir = isWindows ? 'Scripts' : 'bin';
const venvPython = path.join(venvPath, venvBinDir, pythonCommand);

// Check if virtual environment exists
const hasVenv = fs.existsSync(venvPath);
const pythonPath = hasVenv && fs.existsSync(venvPython) ? venvPython : pythonCommand;

const vibeMatcherProcess = spawn(pythonPath, ['vibe_matcher.py'], {
  cwd: vibeMatcherPath,
  stdio: 'pipe',
  shell: true
});

vibeMatcherProcess.stdout.on('data', (data) => {
  console.log(colors.python, `[PYTHON] ${data.toString().trim()}`);
});

vibeMatcherProcess.stderr.on('data', (data) => {
  console.error(colors.python, `[PYTHON ERROR] ${data.toString().trim()}`);
});

// Handle process exit
process.on('SIGINT', () => {
  console.log(colors.system, '[SYSTEM] Shutting down services...');
  
  nodeServer.kill('SIGINT');
  vibeMatcherProcess.kill('SIGINT');
  
  process.exit(0);
});

// Log if either service exits
nodeServer.on('close', (code) => {
  console.log(colors.system, `[SYSTEM] Node.js server exited with code ${code}`);
  if (code !== 0 && !nodeServer.killed) {
    process.exit(code);
  }
});

vibeMatcherProcess.on('close', (code) => {
  console.log(colors.system, `[SYSTEM] Python vibe matcher exited with code ${code}`);
  if (code !== 0 && !vibeMatcherProcess.killed) {
    process.exit(code);
  }
});

console.log(colors.system, '[SYSTEM] All services started successfully!');