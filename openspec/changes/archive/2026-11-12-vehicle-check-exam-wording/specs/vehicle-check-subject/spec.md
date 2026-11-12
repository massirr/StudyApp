## ADDED Requirements

### Requirement: Random-check questions follow the official exam wording
The "Banden en vloeistoffen" topic SHALL include questions on what the examiner expects for the random checks, as stated in the official GOCA exam brochure (Doc. 133, Cat. B, Vlaams Gewest). They SHALL cover at least: showing the tyre valve for the tyre-pressure check, the tyre-wear procedure (turn the wheels, get out, show the grooves, one front wheel only), closing the bonnet and making sure it is properly closed after a bonnet check, and showing an electronic meter on the dashboard when the car has no dipstick or gauge in the engine compartment. Each SHALL cite the brochure as a source.

#### Scenario: Tyre-pressure check
- **WHEN** a question asks what to point out when the examiner asks how you check tyre pressure
- **THEN** the correct option SHALL be the tyre valve

#### Scenario: Tyre-wear check
- **WHEN** a question asks what the examiner expects for the tyre-wear check
- **THEN** the correct option SHALL describe turning the wheels, getting out and showing the grooves of one front wheel

#### Scenario: After a bonnet check
- **WHEN** a question asks what you do after pointing out a part under the bonnet
- **THEN** the correct option SHALL be to close the bonnet and check that it is properly closed before getting back in

#### Scenario: Brochure is a listed source
- **WHEN** one of these questions is validated
- **THEN** its `sourceUrls` SHALL contain the brochure URL and that URL SHALL be listed in `sources`
