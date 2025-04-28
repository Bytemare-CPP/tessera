const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  system: '\x1b[33m%s\x1b[0m', // Yellow
  success: '\x1b[32m%s\x1b[0m', // Green
  error: '\x1b[31m%s\x1b[0m', // Red
  info: '\x1b[36m%s\x1b[0m', // Cyan
};

// Path configuration
const vibeMatcherPath = path.join(__dirname, '..', 'src', 'services', 'vibe_matcher');
const isWindows = process.platform === 'win32';
const pythonCommand = isWindows ? 'python' : 'python3';

// Helper function to run a command
function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    console.log(colors.info, `Running: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, {
      ...options,
      stdio: 'inherit',
      shell: true
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

// Helper function to check if a Python package is installed
async function checkPythonPackage(packageName) {
  return new Promise((resolve) => {
    const pythonCheck = spawn(pythonCommand, [
      '-c', 
      `import importlib.util; print(importlib.util.find_spec('${packageName}') is not None)`
    ], { shell: true });
    
    let output = '';
    pythonCheck.stdout && pythonCheck.stdout.on('data', (data) => {
      output += data.toString().trim();
    });
    
    pythonCheck.on('close', () => {
      resolve(output === 'True');
    });
  });
}

async function setup() {
  try {
    console.log(colors.system, '🚀 Setting up Python vibe matcher service...');
    
    // Check if Python is installed
    try {
      await runCommand(pythonCommand, ['--version'], {});
      console.log(colors.success, '✓ Python is installed');
    } catch (error) {
      console.error(colors.error, `❌ Python is not installed or not in PATH: ${error}`);
      console.error(colors.error, '   Please install Python 3.8 or later and try again.');
      process.exit(1);
    }
    
    // Check if the venv module is available
    const hasVenvModule = await checkPythonPackage('venv');
    if (!hasVenvModule) {
      console.error(colors.error, '❌ Python venv module not found');
      console.error(colors.error, '   This is usually included with Python 3.3+');
      console.error(colors.error, '   Try installing it with: python -m pip install virtualenv');
      process.exit(1);
    }
    
    // Create vibe_matcher directory if it doesn't exist
    if (!fs.existsSync(vibeMatcherPath)) {
      console.error(colors.error, '❌ Vibe matcher directory not found at:', vibeMatcherPath);
      console.error(colors.error, '   Please ensure the project structure is correct.');
      process.exit(1);
    }
    
    const venvPath = path.join(vibeMatcherPath, 'venv');
    
    // Check if venv already exists
    if (fs.existsSync(venvPath)) {
      console.log(colors.info, 'ℹ️ Virtual environment already exists.');
      const shouldRecreate = process.argv.includes('--force');
      
      if (shouldRecreate) {
        console.log(colors.system, '🔄 Recreating virtual environment...');
        // Delete the existing venv
        try {
          if (isWindows) {
            await runCommand('rmdir', ['/s', '/q', venvPath], {});
          } else {
            await runCommand('rm', ['-rf', venvPath], {});
          }
        } catch (error) {
          console.error(colors.error, `❌ Failed to delete existing venv: ${error.message}`);
          console.error(colors.error, '   You may need to delete it manually.');
          process.exit(1);
        }
      } else {
        console.log(colors.info, 'ℹ️ Using existing environment. Use --force to recreate it.');
      }
    }
    
    // Create virtual environment if it doesn't exist or was deleted
    if (!fs.existsSync(venvPath)) {
      console.log(colors.system, '🔨 Creating virtual environment...');
      try {
        await runCommand(pythonCommand, ['-m', 'venv', 'venv'], { cwd: vibeMatcherPath });
        console.log(colors.success, '✓ Virtual environment created');
      } catch (error) {
        console.error(colors.error, `❌ Failed to create virtual environment: ${error.message}`);
        process.exit(1);
      }
    }
    
    // Install dependencies
    console.log(colors.system, '📦 Installing Python dependencies...');
    
    // Get the pip path based on platform
    const pipPath = isWindows 
      ? path.join(venvPath, 'Scripts', 'pip.exe')
      : path.join(venvPath, 'bin', 'pip');
    
    // Check if requirements.txt exists
    const requirementsPath = path.join(vibeMatcherPath, 'requirements.txt');
    if (!fs.existsSync(requirementsPath)) {
      console.error(colors.error, '❌ requirements.txt not found at:', requirementsPath);
      process.exit(1);
    }
    
    // Install required packages
    try {
      await runCommand(pipPath, ['install', '--upgrade', 'pip'], { cwd: vibeMatcherPath });
      await runCommand(pipPath, ['install', '-r', 'requirements.txt'], { cwd: vibeMatcherPath });
      console.log(colors.success, '✓ Python dependencies installed');
    } catch (error) {
      console.error(colors.error, `❌ Failed to install dependencies: ${error.message}`);
      console.error(colors.error, '   You may need to install them manually.');
      process.exit(1);
    }
    
    console.log(colors.success, '');
    console.log(colors.success, '✅ Vibe matcher setup complete! 🎉');
    console.log(colors.success, '');
    console.log(colors.system, 'To run the service:');
    console.log(colors.info, '  npm run dev');
    console.log(colors.system, '');
    console.log(colors.system, 'If you experience issues, you can manually activate the virtual environment:');
    
    if (isWindows) {
      console.log(colors.info, '  cd src\\services\\vibe_matcher');
      console.log(colors.info, '  venv\\Scripts\\activate');
    } else {
      console.log(colors.info, '  cd src/services/vibe_matcher');
      console.log(colors.info, '  source venv/bin/activate');
    }
    
  } catch (error) {
    console.error(colors.error, '❌ Setup failed with an unexpected error:');
    console.error(error);
    process.exit(1);
  }
}

setup();