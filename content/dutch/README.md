# Dutch source material (NL3 / YB1398)

Drop source files for **Nederlands 3 (YB1398)** here — texts, word lists, exercises,
whatever the teacher handed out. They are **not** bundled into the app; they are the
input from which `src/data/subjects/yb1398.json` is authored.

The subject covers the course's seven chapters (`h0-herhaling` … `h6-op-gesprek`)
with **80 questions**: 30 `single`, 9 `multiple`, 23 `shortText`, 18 `freeText`.

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
| `single` | Radio, auto-graded | Choosing between candidate *words* — *Toen* vs *Als*, *want* vs *omdat*, *heeft* vs *is* |
| `multiple` | Checkboxes, auto-graded on the whole set | Category sorting (which verbs take -de, which words are de-woorden) |
| `shortText` | Single-line input; the app checks it against `acceptedAnswers` and marks it right or wrong | Producing a *form* from memory — zou/zullen, imperfectum, relatief pronomen, inversie |
| `freeText` | Textarea; on submit reveals `sampleAnswer` and the learner self-grades ✓/✗ | Open-ended production: sentence combining, all five oral answers |

Typed answers matter most for the retake — they are the only types that drill
*producing* Dutch rather than recognising it.

**`shortText` vs `freeText`** is the difference between an answer the app can check
and one it cannot. `shortText` compares the typed answer against `acceptedAnswers`
after normalising case, whitespace, apostrophe style and trailing punctuation —
so `Zou`, ` zou ` and `zou.` all pass, but `werkde` does not. Spelling is never
forgiven, because that is what the exam does. `freeText` is never string-matched,
because "combineer deze twee zinnen" has several correct answers.

**Which gap fills stayed `single`** — a question is `shortText` only when the
learner must produce a grammatical form. Where the exercise is *choosing between
candidate words* (q-7, q-12, q-47, q-48, q-49, q-68, q-69, q-71, q-79), the options
are the exercise: typing `Toen` is trivial once you know it, while seeing
*Toen / Als / Wanneer / Terwijl* forces the discrimination.

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
