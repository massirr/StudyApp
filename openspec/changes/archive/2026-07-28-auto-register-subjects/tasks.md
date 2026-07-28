# Tasks: auto-register-subjects

## 1. Registry auto-discovery

- [x] 1.1 Add `/// <reference types="vite/client" />` to `src/vite-env.d.ts` so
      `import.meta.glob` is typed.
- [x] 1.2 Replace the hand-maintained `RAW` array in `src/data/subjects/index.ts`
      with an eager `import.meta.glob('./*.json')`, validating each module's
      default export with `validateSubject`. Sort by file path for deterministic
      order (dp-750 before yb1398 today).
- [x] 1.3 Update `src/data/subjects/index.test.ts`: assert yb1398 is discovered
      without being imported anywhere, alongside the existing dp-750 assertions.

## 2. Policy-aware sources heading

- [x] 2.1 In `src/pages/TopicPage.tsx`, render the sources `<h2>` as
      "Official Microsoft Sources" only when `subject.sourcePolicy === 'microsoft-only'`;
      otherwise "Sources".

## 3. Verify

- [x] 3.1 `npm run test:unit` passes.
- [x] 3.2 `npm run build` (tsc + vite) passes.
