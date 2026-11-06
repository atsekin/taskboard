import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const run = (cmd, args) =>
  execFileSync(cmd, args, { stdio: 'pipe', shell: process.platform === 'win32' });

// 1. ESLint
if (/\.(ts|tsx|js|jsx)$/.test(file)) {
  try {
    run('npx', ['eslint', '--fix', file]);
  } catch (e) {
    process.stderr.write(
      `ESLint found errors that cannot be fixed automatically in ${file}:\n${e.stdout}`
    );
    process.exit(2);
  }
}

// 2. Prettier
/*try {
  run('npx', ['prettier', '--write', '--ignore-unknown', file]);
} catch {
  // A formatting error should not interfere with the work.
}

process.exit(0);*/