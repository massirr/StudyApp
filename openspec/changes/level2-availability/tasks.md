## 1. Gate the score-screen CTA

- [x] 1.1 In `src/components/quiz/QuizPage.tsx`, derive Level-2 availability with the same `getCodeSnippetQuestionsForTopic(...).length > 0` check `TopicPage` uses, and require it in `showLevel2Cta` so both the CTA and the unlock hint are suppressed when the topic has no Level-2 questions
- [x] 1.2 Confirm `markLevel2Unlocked` still fires on a ≥70% pass for a topic with no Level-2 questions (progress stays truthful; only the link is hidden)

## 2. Verify

- [x] 2.1 Unit tests + typecheck green, no new lint errors
- [x] 2.2 Drive DP-750 `case-study-lakehouse` (0 code questions) — pass at ≥70%, confirm no Level-2 CTA and no unlock hint
- [x] 2.3 Drive a DP-750 topic that has code questions — confirm the CTA still appears and still opens a populated Level-2 quiz
- [x] 2.4 Drive the Dutch topic — confirm no Level-2 CTA, and that the unlock is still recorded in `localStorage`
