## Why

Quiz questions currently link to broad landing pages (e.g., `/azure/databricks/`, `/entra/`) that don't directly address the specific concept being tested. Users clicking "View Official Source" land on high-level docs and must navigate further — reducing educational value. Additionally, the FeedbackPanel shows a generic "View Official Source" label for every link, ignoring the existing source registry that already has meaningful labels.

## What Changes

- Replace broad root-level `sourceUrls` in all 50 quiz questions with specific, deep-linked Microsoft Learn pages relevant to each question's concept
- Add new entries to `sources.ts` registry for specific deep-link pages
- Update `FeedbackPanel` to show the source title/label from the registry alongside each link (instead of static "View Official Source" text)
- Pass `sources` lookup context into `FeedbackPanel` so labels can be resolved from `sourceUrls`

## Capabilities

### New Capabilities

- `specific-source-urls`: Replace all generic root-URL source references in `questions.ts` with specific Microsoft Learn deep-links matched to each question's concept. Update `sources.ts` registry with entries for all new URLs.
- `source-label-display`: Update `FeedbackPanel` to resolve and display the source's human-readable label (from the registry) next to each "View Source" link, falling back to the URL domain if unregistered.

### Modified Capabilities

_(none — no existing spec-level behavior changes)_

## Impact

- `src/data/questions.ts` — all 50 questions' `sourceUrls` updated
- `src/data/sources.ts` — new `SourceReference` entries for deep-link pages
- `src/components/quiz/FeedbackPanel.tsx` — label lookup and display logic added
- `src/components/quiz/FeedbackPanel.module.css` — minor styling if source label needs layout
- No type changes required; `sourceUrls: string[]` shape unchanged
