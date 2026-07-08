# Spec: Topic Study Experience

## Purpose

Give each topic page a predictable, compact study structure — orientation, subtopics, official sources, notes, and a quiz entry — so a topic reads as a focused workspace rather than a wall of text. (Route shapes are defined in `subject-catalog`.)

## Requirements

### Requirement: Topic page shows title and summary
The topic page SHALL clearly show the current topic's title and summary at the top.

#### Scenario: Current topic is obvious
- **WHEN** a topic page renders
- **THEN** the topic title and summary SHALL be visible without scrolling past other content

### Requirement: Subtopics render in a stable order
The topic page SHALL present the topic's subtopics as an ordered, scannable list.

#### Scenario: Subtopics ordered
- **WHEN** a topic has multiple subtopics
- **THEN** they SHALL render in the topic's defined order

### Requirement: Official source links are visible on the page
The topic page SHALL show the topic's source links inline, without requiring separate navigation.

#### Scenario: Sources shown inline
- **WHEN** a topic page renders
- **THEN** its source links SHALL be visible on the page

### Requirement: Study notes render when present
When a topic has grounded study notes, the topic page SHALL display them.

#### Scenario: Notes displayed
- **WHEN** a topic has one or more content notes
- **THEN** those notes SHALL be shown on the topic page

### Requirement: Quiz entry is present but non-intrusive
The topic page SHALL provide a clear entry into the topic quiz without replacing or interrupting the reading content.

#### Scenario: Quiz entry available
- **WHEN** a topic page renders
- **THEN** a link into the topic quiz SHALL be present alongside (not instead of) the study content
