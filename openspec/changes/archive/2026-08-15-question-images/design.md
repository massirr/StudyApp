## Context

`QuizQuestion` already carries an optional `codeSnippet` for DP-750, so questions are not assumed to be text-only — but there is no image field, and `QuestionDisplay` renders prompt, optional snippet, then the answer controls. Topics can carry a `passage` and `audio`, both rendered above the whole deck by `QuizPage`; neither is per-question.

Two NL3 exercises are visual in the source material. The course teaches "Een tweeling" (H3 3.4) from a photo of two women labelled Anne and Lies, and the cooking verbs (H4 4.5) from a plate of photos matched against infinitives. Oral questions 2 and 3 mirror both.

The images exist inside the course PDF and extract cleanly as JPEG: the tweeling figure is 655×586 (~54 KB), the cooking plate 1104×586 (~102 KB).

## Goals / Non-Goals

**Goals:**
- Let a question show one image, additively, without touching any existing question.
- Alternative text that is actually present, because these are describe-what-you-see questions and a blank `alt` would make them impossible for a screen-reader user.
- No horizontal overflow on a phone — this codebase has produced that bug three times already.

**Non-Goals:**
- Images as answers, image galleries, zoom.
- Importing the PDF's other ~100 images.

## Decisions

### `image: { src, alt }`, not a bare `src` string
*Why:* a bare string makes `alt` an afterthought, and the whole point of these two questions is describing what is in the picture. Bundling them means the type cannot express an image without somewhere to put its description, and the validator can enforce it.

*Alternative considered:* `imageSrc` + `imageAlt` as sibling optional fields. Rejected — two loosely-coupled optionals let one be set without the other, and the invariant "an image always has alt text" then lives only in the validator instead of the shape.

### `alt` is required, enforced at load
`validateSubject` throws on a missing or empty `alt`, exactly as it does for `freeText` without `sampleAnswer` and `shortText` without `acceptedAnswers`.

*Why:* subjects are validated when they load, so a content mistake fails immediately and loudly with the question id, rather than shipping a silently inaccessible question. Accessibility basics are not something to leave to reviewer discipline.

### Static assets under `public/images/nl3/`, referenced by absolute path
*Why:* `public/` is copied verbatim by Vite and the repo already uses it for `public/audio/nl3/`. An absolute `/images/nl3/…` path works under the SPA rewrite in `vercel.json`, which only rewrites non-`/api` routes to `index.html` for navigation — static files are served before that.

*Alternative considered:* importing the JPEGs as modules so Vite fingerprints them. Rejected — content lives in JSON, not TypeScript, so it cannot hold an import; a string path is the only thing JSON can express.

### Constrain with `max-width: 100%; height: auto`
*Why:* the stylesheet now has a `border-box` reset, but an `<img>` with intrinsic pixel dimensions still overflows a narrower parent unless capped. `height: auto` keeps the aspect ratio. This is the same class of bug that produced the card overlap and the textarea overflow, so it is specified rather than left to chance.

### Keep the prose description as a fallback in `q-53`'s explanation
*Why:* the image is the exercise, but the explanation is read after answering and is where the model answer lives. Someone who cannot see the image still gets the vocabulary, and `alt` carries the visual facts needed to attempt it.

## Risks / Trade-offs

- **The image 404s and the question becomes unanswerable** → `alt` is mandatory and descriptive enough to attempt the question from text alone, so a broken asset degrades rather than blocks.
- **Bundle size** → two files, ~160 KB total, against a build that already warns at 500 KB for JS. Only two images are added, and the non-goal of bulk-importing the rest keeps it that way.
- **Reproducing course figures in a public repo** → these are two figures from the learner's own course PDF, used in an unofficial personal study aid that already labels itself as such. Provenance is recorded in `content/dutch/README.md` so it is not silently unattributed. Flagged to the user before implementing; they chose to proceed.
- **Layout shift as the image loads** → acceptable for two images on a study page; `width`/`height` attributes could be added later if it becomes annoying.

## Migration Plan

Purely additive: an optional field, two new static files, two content edits. Rollback is a revert; no stored data is involved.

## Open Questions

- Should oral-prep questions eventually accept a learner-supplied photo rather than a fixed one? Closer to the exam, but needs file handling and storage — out of scope here.
