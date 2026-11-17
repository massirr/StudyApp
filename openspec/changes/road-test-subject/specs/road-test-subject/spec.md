## ADDED Requirements

### Requirement: Road Test subject is available
The app SHALL provide a subject with slug `road-test` that passes `validateSubject` and appears in the subject picker. It SHALL have `sourcePolicy: 'any'` and a `shortLabel` using only supported glyphs.

#### Scenario: Subject loads
- **WHEN** the app loads its subjects
- **THEN** `road-test` SHALL be present with five topics: exam day in Mollem, signs, mistakes that end the exam, calm driving, manoeuvres and videos

### Requirement: Exam day intro names the exam centre
The first topic SHALL give the exam centre's name, address and contact (Examencentrum Mollem, Industriezone Z.5 Mollem 80, 1730 Mollem), and the interpreter rules: a sworn interpreter for French, German or English, chosen and paid by the candidate, announced to the test centre in advance, and not the same person as the companion.

#### Scenario: Interpreter languages
- **WHEN** a question asks which languages a sworn interpreter may assist in
- **THEN** the correct answer SHALL be French, German or English

### Requirement: Signs that end the exam are covered
The signs topic SHALL cover C1, C3, C31, C33, D1, D3 and D5 (an immediate fail if ignored) and the priority signs B1, B5, B9, B11, B15 and B17. Sign meanings SHALL use the wording of the current traffic regulation (art. 67–71), not the 2027 code.

#### Scenario: No-entry sign
- **WHEN** a question shows sign C1 and asks what it means
- **THEN** the correct answer SHALL be "Verboden richting voor iedere bestuurder"

#### Scenario: GPS versus a sign
- **WHEN** a question says the GPS points into a street with sign C1
- **THEN** the correct answer SHALL be not to enter, because the road code always beats the GPS

### Requirement: Mistakes that end the exam come from GOCA
The mistakes topic SHALL list the GOCA "niet geslaagd" and "stopgezet" rules, and its wrong options SHALL be actions the sources explicitly allow.

#### Scenario: Companion intervenes
- **WHEN** a question says the companion switches on the wipers during the drive
- **THEN** the correct answer SHALL be that the exam stops and the candidate fails

### Requirement: Manoeuvre rules and videos
The manoeuvres topic SHALL state the official rules per manoeuvre (including: parallel parking starts beside the car you park behind, reverse in a smooth S-movement, one restart is not a fault, the manoeuvre ends when you rejoin traffic) and SHALL link the VSV manoeuvre videos, each listed in `sources`.

#### Scenario: Parallel parking restart
- **WHEN** a question asks how many restarts are allowed without a fault in parallel parking
- **THEN** the correct answer SHALL be one

### Requirement: Content is bilingual, sourced and illustrated
Every prompt SHALL give Dutch with an English rendering in brackets, every question SHALL cite at least one listed source, and every image SHALL exist under `public/` with a descriptive `alt`.

#### Scenario: Sources and images resolve
- **WHEN** the unit tests run
- **THEN** every question's `sourceUrls` SHALL be listed in `sources` and every `image.src` SHALL exist
