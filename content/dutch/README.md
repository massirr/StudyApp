# Dutch source material

Drop your exam source files (texts, word lists, exercises) in this folder. They are
**not** bundled into the app — `src/data/subjects/dutch.json` is authored from them.

## Current state: placeholder

`src/data/subjects/dutch.json` currently holds **one placeholder topic** ("Op het
station") written only to validate the pipeline end-to-end: reading passage → audio
player → MCQs → free-text self-grade → ≥70% Level-2 unlock. Replace it with real
content from your source material.

## Audio

`public/audio/dutch/op-het-station.mp3` is a 2-second **silent** placeholder so the
player has something to load. Replace it with the NotebookLM download, keeping the
same filename (or update `topic.audio.src` in `dutch.json`).
