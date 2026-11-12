## Context

`t-4` has 31 questions. They mix identification (photos), vocabulary and general car knowledge from Kwik-Fit, ANWB and Test-Aankoop. The official brochure (GOCA Doc. 133, 18.08.2026, p. 7) is the authority on what the examiner asks, and the subject's `sourcePolicy` is `any` with GOCA preferred, so the brochure outranks the general sources where they differ in emphasis.

## Decisions

1. **Add, do not remove.** Existing questions stay. Knowing how to read a dipstick is still useful; one new question states that the exam does not ask for it.
2. **Seven questions, brochure wording:**
   - `q-82` valve for the tyre-pressure check (single)
   - `q-83` tyre-wear procedure: turn wheels, get out, show grooves, one front wheel, TWI optional (single)
   - `q-84` after a bonnet check: close it and make sure it is properly closed (single)
   - `q-85` only an electronic meter on the dashboard: show where it is (single)
   - `q-86` oil: you point out the dipstick, the level is not actually checked (single)
   - `q-87` "tyre valve" in Dutch: ventiel (typed)
   - `q-88` "bonnet" in Dutch: motorkap (typed)
3. **Distractors are plainly wrong**, never "also arguably right". For example the tyre-pressure sticker in the door frame is not offered as a wrong answer to the valve question, because it is a sensible thing to know.
4. **Answer letters stay balanced.** `t-4` is a/b/c/d = 5/5/6/5 now. The five new single-choice answers use b, d, a, c, a, giving 7/6/7/6 (spread 1; the policy allows 2). Option ids stay positional.
5. **Source.** New entry `src-22` for the PDF at its CDN URL (the exact version file). `src-1` (the autoveiligheid.be download page) stays: it is cited by many questions, and rewriting it means touching all of them the day before the exam.
6. **Claims stay inside the brochure.** Each explanation says only what page 7 says; the PDF does not state a tread depth or a pressure value, so those stay sourced as before.
7. **Notes and docs.** Extend note `note-4` (the `t-4` topic note) and `content/vehicle-check/exam-procedure.md` with the expectations, so the topic page matches the quiz.

## Risks

- A distractor that is also correct in practice confuses the learner: re-read each option set against the brochure.
- The brochure is in Dutch and the learner reads the app in both languages: keep the English rendering faithful, not looser.
- Order: new questions go at the end of the data, so they appear last in the quiz and existing progress is unaffected.
