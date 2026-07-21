## ADDED Requirements

### Requirement: Optional per-topic reading passage
A topic MAY carry an optional `passage` ({ `title?`, `text` }). When present, the passage SHALL be rendered above that topic's questions so the learner can read it while answering. When absent, the quiz SHALL render unchanged.

#### Scenario: Passage shown above questions
- **WHEN** a topic with a `passage` is quizzed
- **THEN** the passage text (and title, if given) SHALL appear above the question deck

#### Scenario: No passage, no change
- **WHEN** a topic has no `passage`
- **THEN** the quiz SHALL render with no passage region

### Requirement: Optional per-topic audio clip
A topic MAY carry an optional `audio` ({ `src`, `title?` }). When present, the app SHALL render a native HTML audio player (`<audio controls>`) sourced from `src` above that topic's questions. No third-party audio library SHALL be introduced.

#### Scenario: Audio player shown
- **WHEN** a topic with an `audio.src` is quizzed
- **THEN** a playable native audio control SHALL appear above the question deck

#### Scenario: Missing audio file degrades gracefully
- **WHEN** a topic has no `audio`
- **THEN** no audio player SHALL be rendered and the quiz SHALL function normally
