# Dutch source material (NL3 / YB1398)

Drop source files for **Nederlands 3 (YB1398)** here — texts, word lists, exercises,
whatever the teacher handed out. They are **not** bundled into the app; they are the
input from which `src/data/subjects/yb1398.json` is authored.

The subject covers the course's seven chapters (`h0-herhaling` … `h6-op-gesprek`)
with **82 questions**: 55 `single`, 9 `multiple`, 18 `freeText`.

## What's here

| Path | What it is |
|---|---|
| `cursus-nl3/` | The full course PDF as markdown, one file per hoofdstuk — see its README |
| `retake-2025-2026.md` | The retake slides: exam format, the 5 grammar tasks, the 5 oral questions |

Both are the *input* from which `src/data/subjects/yb1398.json` is authored. They are
not bundled into the app.

## Question types and what they drill

| Type | Learner experience | Used for |
|---|---|---|
| `single` | Radio, auto-graded | Gap-fill where recognising the form is enough (relatief pronomen, zou/zullen) |
| `multiple` | Checkboxes, auto-graded on the whole set | Category sorting (which verbs take -de, which words are de-woorden) |
| `freeText` | Textarea; on submit reveals `sampleAnswer` and the learner self-grades ✓/✗ | Producing Dutch: irregular verb lists, sentence combining, all five oral answers |

Free-text matters most for the retake — it is the only type that drills *producing*
Dutch rather than recognising it, and the written exam's sentence-combining task
cannot be tested any other way. It is never string-matched; see `design.md`.

`Topic.passage` (reading text above a chapter's deck) is used on **H2** (the Boris
imperfectum text, mirroring written task 2) and **H6** (a vacature, mirroring lezen).

## Still unused

`Topic.audio` — native `<audio controls>`, mp3 under `public/audio/nl3/`. Nothing is
wired up because the course audio lives on Canvas, not in the PDF. Adding it is a
content change to `yb1398.json`; the engine needs nothing. Keep clips short — they
ship in the deployed bundle.

## Answer-letter policy

`answerDistribution.test.ts` fails if any topic's correct `single` answers cluster on
one letter (max−min spread > 2). When adding questions, re-check it — this regressed
once before.
