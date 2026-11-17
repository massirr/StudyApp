## Context

Subjects are JSON files in `src/data/subjects/`, validated by `validateSubject` and listed automatically. A topic page shows the topic summary, subtopics, `sourceLinks` and notes; the quiz shows questions with optional images. `vehicle-check` is the model: bilingual prompts "Dutch (English)", positional option ids, balanced answer letters, every fact sourced.

## Sources (in order of authority)

1. **GOCA Vlaanderen, "Op weg naar het rijbewijs B – het praktijkexamen in Vlaanderen toegelicht"**, version 16/09/2026. The 13 scoring categories, every "niet geslaagd" and "stopgezet" rule, the fail list for signs C1, C3, C31, C33, D1, D3 and D5, and the manoeuvre rules.
2. **GOCA Doc. 133, Cat. B, Vlaams Gewest**, version 18.08.2026. Manoeuvre groups, interpreter rules (French, German or English; the interpreter cannot be the companion; GPS translation), what the examiner says and never does.
3. **Verkeersreglement (KB 1 december 1975), art. 67–71**, on wegcode.be (Vias). Official names of the signs. The 2027 road code and its new signs do **not** apply to a December 2026 exam and are not used.
4. **vlaanderen.be, "How to obtain a category B driving licence"**. You choose and pay the sworn interpreter yourself and contact the test centre in advance.
5. **VSV (Vlaamse Stichting Verkeerskunde) on YouTube**: "Manoeuvre 1–5", "De examenrit", "Rijles 7", "Een rotonde oprijden", "Klaar voor het praktijkexamen?", "Instappen en klaarmaken voor vertrek". Each one is checked with YouTube oEmbed (title and channel). They are 4–6 years old. They are useful to see the movement, but where they differ from the 2026 brochure, the brochure wins.
6. The exam centre's contact details come from the learner's screenshot of the centre's page. The phone number matches a public test-centre listing (permis.online).

## Decisions

1. **New subject, not more `vehicle-check` topics.** The drive is a different part of the exam and the learner asked for a new subject. Slug `road-test`, `shortLabel` `ROAD TEST` (pixel glyphs only).
2. **Signs are drawn, not copied.** Simple SVGs in the app's own style: shape, colour and symbol of the current Belgian sign. They are original diagrams, so the existing photo-credit rule does not apply. B19 and B21 (narrow passage) are only mentioned in text, because the arrow layout is easy to draw wrong.
3. **Distractors that are explicitly allowed.** For "which mistake means an immediate fail" questions, the wrong options are things the sources explicitly allow (restarting parallel parking once, stopping legally to adjust mirrors, turning the GPS sound off). That avoids options that are also faults.
4. **Calm-driving topic uses only sourced facts.** It covers what the examiner promises and does: never sets a trap, announces turns in time, says nothing means follow your lane, won't tell you when to use lights or wipers, you may stop legally, the GPS can be overruled. There are no generic anxiety tips without a source.
5. **Videos as links.** VSV videos go in topic `sourceLinks` and `sources` with a usage note. No embedding (out of scope for v1).
6. **Exam centre in the intro, exam date not.** The site is public, so the address and contact of the centre (a business) are shown, but not the learner's exam date.
7. **Answer balance.** The generator places each correct answer at a planned letter so every topic keeps a spread of 2 or less.

## Risks

- **Wrong sign meaning:** every meaning is copied from art. 67–71 of the current regulation, and the sign images are checked by eye at phone width.
- **Brochure vs video differences:** labelled in the usage note.
- **Rules change in 2027:** the new code starts 1 June 2027, after the exam; a note says so.
