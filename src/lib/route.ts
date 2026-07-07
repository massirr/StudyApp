export type Route =
  | { kind: 'picker' }
  | { kind: 'dashboard'; subject: string }
  | { kind: 'topic'; subject: string; topicSlug: string }
  | { kind: 'quiz'; subject: string }
  | { kind: 'notFound' }
  | { kind: 'redirect'; to: string };

export function parseRoute(pathname: string): Route {
  const clean = pathname.replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return { kind: 'picker' };
  const [subject, seg, rest] = parts;

  if (parts.length === 1) return { kind: 'dashboard', subject };
  if (seg === 'quiz' && parts.length === 2) return { kind: 'quiz', subject };
  if (seg === 'topics' && parts.length === 3) return { kind: 'topic', subject, topicSlug: rest };
  if (seg === 'topic' && parts.length === 3) return { kind: 'redirect', to: `/${subject}/topics/${rest}` };
  return { kind: 'notFound' };
}
