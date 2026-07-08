// Collision-safe sequential id: `${prefix}-${n}` where n is one past the
// highest existing numeric suffix for that prefix.
export function nextId(prefix: string, existing: string[]): string {
  const re = new RegExp(`^${prefix}-(\\d+)$`);
  const max = existing.reduce((m, id) => {
    const match = id.match(re);
    return match ? Math.max(m, Number(match[1])) : m;
  }, 0);
  return `${prefix}-${max + 1}`;
}
