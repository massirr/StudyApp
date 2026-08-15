# Dutch source material (NL3 / YB1398)

Drop source files for **Nederlands 3 (YB1398)** here — texts, word lists, exercises,
whatever the teacher handed out. They are **not** bundled into the app; they are the
input from which `src/data/subjects/yb1398.json` is authored.

The subject covers the course's seven chapters (`h0-herhaling` … `h6-op-gesprek`)
with **80 questions**: 21 `single`, 9 `multiple`, 32 `shortText`, 18 `freeText`.

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
| `single` | Radio, auto-graded | Conceptual questions with no blank — *Welke zin drukt een WENS uit?*, *Welk voegwoord is onderschikkend?* |
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

**Every gap fill is now `shortText`.** An earlier pass kept nine word-choice items
(`Toen` vs `Als`, `want`, `heeft`/`is`/`draagt`) as multiple choice on the grounds
that the options *were* the exercise; that was reversed deliberately — typing is
the better drill for all of them, and the exam never offers options.

Removing the options made two prompts ambiguous, which is worth knowing before
adding more:

- **q-69** `Eerst gingen we wandelen. ____ dronken we iets` — `Daarna`, `Dan` and
  `Vervolgens` are all correct, so all three are in `acceptedAnswers`.
- **q-71** `____ het eten hebben we een museum bezocht` — `Voor` is as grammatical
  as `Na`. Rather than accept both (they mean opposite things, and the point is
  `Na` vs `Nadat`), the prompt gained a first sentence — *We hebben eerst
  gegeten.* — which forces `Na`.

When converting an MCQ to `shortText`, always re-read the prompt without its
options: distractors often carry disambiguation the sentence itself does not.

The 21 remaining `single` questions have no blank at all — they ask about a
concept, so there is nothing to type.

`Topic.passage` (reading text above a chapter's deck) is used on **H2** (the Boris
imperfectum text, mirroring written task 2) and **H6** (a vacature, mirroring lezen).

## Still unused

`Topic.audio` — native `<audio controls>`, mp3 under `public/audio/nl3/`. Nothing is
wired up because the course audio lives on Canvas, not in the PDF. Adding it is a
content change to `yb1398.json`; the engine needs nothing. Keep clips short — they
ship in the deployed bundle.

## Images

Two figures from the course PDF are reproduced under `public/images/nl3/`, because
the exercises they belong to are visual and cannot be written out without losing
what they teach:

| File | Source | Used by |
|---|---|---|
| `tweeling-anne-lies.jpg` | Cursus NL3 p.32, H3 3.4 "Een tweeling" | q-53 — oral Q2, compare two people |
| `kookwerkwoorden.jpg` | Cursus NL3 p.48, H4 4.5 cooking verbs | q-60, q-61, q-63 — imperatief and oral Q3 |

They are figures from An Fraipont & Katrijn Leemans' course, reproduced here in an
unofficial personal study aid. No other images from the PDF are bundled.

`QuizQuestion.image` requires a non-empty `alt`, enforced by `validateSubject` —
these are describe-what-you-see questions, so alt text is what makes them
answerable without the picture, not a nicety. Write it with the visual facts the
answer needs (age, build, hair, distinguishing features), not "photo of two women".

## Answer-letter policy

`answerDistribution.test.ts` fails if any topic's correct `single` answers cluster on
one letter (max−min spread > 2). When adding questions, re-check it — this regressed
once before.
