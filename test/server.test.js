const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');

const backendDir = path.join(__dirname, '..');

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], {
      cwd: backendDir,
      env: { ...process.env, PORT: '5010' },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Server failed to start: ${output}`));
    }, 5000);

    child.on('spawn', () => {
      setTimeout(() => resolve({ child, output }), 1000);
    });

    child.on('exit', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`Server exited early: ${output}`));
      }
    });
  });
}

test('backend exposes auth and student endpoints', async () => {
  const { child } = await startServer();

  try {
    const sendOtpResponse = await fetch('http://127.0.0.1:5010/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '1234567890' })
    });
    const sendOtpBody = await sendOtpResponse.json();
    assert.equal(sendOtpResponse.status, 200);
    assert.equal(sendOtpBody.success, true);

    const verifyOtpResponse = await fetch('http://127.0.0.1:5010/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '1234567890', otp: '1234' })
    });
    const verifyOtpBody = await verifyOtpResponse.json();
    assert.equal(verifyOtpResponse.status, 200);
    assert.equal(verifyOtpBody.success, true);

    const invalidOtpResponse = await fetch('http://127.0.0.1:5010/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '1234567890', otp: '9999' })
    });
    const invalidOtpBody = await invalidOtpResponse.json();
    assert.equal(invalidOtpResponse.status, 401);
    assert.equal(invalidOtpBody.success, false);

    const validAdminResponse = await fetch('http://127.0.0.1:5010/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@edsurx.com', password: 'admin123' })
    });
    const validAdminBody = await validAdminResponse.json();
    assert.equal(validAdminResponse.status, 200);
    assert.equal(validAdminBody.success, true);

    const invalidAdminResponse = await fetch('http://127.0.0.1:5010/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@edsurx.com', password: 'wrong' })
    });
    const invalidAdminBody = await invalidAdminResponse.json();
    assert.equal(invalidAdminResponse.status, 401);
    assert.equal(invalidAdminBody.success, false);

    const createStudentResponse = await fetch('http://127.0.0.1:5010/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Asha', phone: '1234567890' })
    });
    const createStudentBody = await createStudentResponse.json();
    assert.equal(createStudentResponse.status, 200);
    assert.equal(createStudentBody.success, true);
    assert.equal(createStudentBody.data.student.fullName, 'Asha');
  } finally {
    child.kill();
  }
});
