import { readFileSync } from 'node:fs';
import path from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const file = input.tool_input?.file_path ?? '';
const name = path.basename(file);

const rules = [
  { test: /^\.env/, reason: 'contains secrets and local settings. Tell the user which variable to add; they should add it themselves.' },
  { test: /^package-lock\.json$/, reason: 'should only be modified via npm. Suggest the `npm install` command to the user.' },
  { test: /^vite\.config\.ts$/, reason: 'build configuration should only be modified after prior agreement. Describe the required change and ask the user.' },
];

const hit = rules.find((r) => r.test.test(name));
if (hit) {
  process.stderr.write(`Modifying ${name} is prohibited: ${hit.reason}`);
  process.exit(2);
}
process.exit(0);