import fs from 'fs';

const specPath = process.argv[2] || 'CLAUDE.md';
const content = fs.readFileSync(specPath, 'utf8');
const required = ['Goal', 'Architecture', 'Success Criteria'];
const missing = required.filter(section => !content.includes(`## ${section}`));
if (missing.length) {
  console.error(`Missing required section(s): ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Spec validation passed.');
process.exit(0);
