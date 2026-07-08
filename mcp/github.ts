const API = 'https://api.github.com';

function cfg() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  const branch = process.env.GITHUB_BRANCH ?? 'master';
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPO are required');
  return { token, repo, branch };
}

const filePath = (slug: string) => `src/data/subjects/${slug}.json`;

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export async function readSubject(slug: string): Promise<{ subject: unknown; sha: string }> {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${filePath(slug)}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}) for ${slug}`);
  const data = (await res.json()) as { content: string; sha: string };
  const json = Buffer.from(data.content, 'base64').toString('utf8');
  return { subject: JSON.parse(json), sha: data.sha };
}

export async function listSubjectSlugs(): Promise<string[]> {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/git/trees/${branch}?recursive=1`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub tree fetch failed (${res.status})`);
  const data = (await res.json()) as { tree: { path: string }[] };
  return data.tree
    .map((e) => e.path)
    .filter((p) => /^src\/data\/subjects\/[^/]+\.json$/.test(p))
    .filter((p) => !/\/(schema|index)/.test(p))
    .map((p) => p.replace('src/data/subjects/', '').replace('.json', ''));
}

// sha omitted => create new file; provided => update existing.
export async function commitSubject(
  slug: string, subject: unknown, sha: string | undefined, message: string,
): Promise<void> {
  const { token, repo, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${filePath(slug)}`;
  const content = Buffer.from(JSON.stringify(subject, null, 2) + '\n').toString('base64');
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content, branch, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub commit failed (${res.status}) for ${slug}: ${await res.text()}`);
}
