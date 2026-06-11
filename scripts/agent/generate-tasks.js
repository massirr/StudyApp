import fs from 'fs';
import { Octokit } from '@octokit/rest';

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN not set');
  process.exit(1);
}
const octokit = new Octokit({ auth: token });
const specPath = process.argv[2] || 'CLAUDE.md';
const content = fs.readFileSync(specPath, 'utf8');
const taskLines = [...content.matchAll(/^-\s\[\]\s(.+)$/gm)].map(m => m[1].trim());
const repo = process.env.GITHUB_REPOSITORY;
if (!repo) {
  console.error('GITHUB_REPOSITORY not set');
  process.exit(1);
}
const [owner, repoName] = repo.split('/');
(async () => {
  for (const title of taskLines) {
    await octokit.issues.create({ owner, repo: repoName, title, labels: ['agent-task'] });
  }
  console.log('Task generation completed.');
})();
