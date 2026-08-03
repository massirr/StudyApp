# Dutch source material (NL3 / YB1398)

Drop source files for **Nederlands 3 (YB1398)** here — texts, word lists, exercises,
whatever the teacher handed out. They are **not** bundled into the app; they are the
input from which `src/data/subjects/yb1398.json` is authored.

The subject already exists with the course's seven chapters (`h0-herhaling` …
`h6-op-gesprek`) and 13 multiple-choice questions.

## Not yet used by NL3

The quiz engine supports three things no NL3 topic uses yet:

| Field | What it does |
|---|---|
| `Topic.passage` | Reading passage rendered above that chapter's questions |
| `Topic.audio` | Native `<audio controls>` clip; mp3 under `public/audio/nl3/` |
| `type: "freeText"` | Learner types Dutch, then self-grades against `sampleAnswer` |

Free-text matters most for the written retake — it is the only question type that
drills *producing* Dutch rather than recognising it.

Adding any of them is a content change to `yb1398.json`; the engine needs nothing.
Keep audio clips short — they ship in the deployed bundle.
