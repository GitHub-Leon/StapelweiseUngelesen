const { spawn } = require('child_process')

const child = spawn('cmd.exe', ['/c', 'npm run dev -- --host 0.0.0.0 --port 5173'], {
  cwd: process.cwd(),
  detached: true,
  windowsHide: true,
  stdio: 'ignore',
})

child.unref()
console.log(`PID=${child.pid}`)
