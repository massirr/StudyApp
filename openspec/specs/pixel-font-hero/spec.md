# Spec: Pixel Font Hero

## Purpose

Define how the animated pixel wordmark renders for any subject. Instead of a hand-drawn "DP-750" SVG, `PixelLogo` renders arbitrary short labels from a reusable 5×7 pixel-font glyph map, preserving the existing GSAP reveal-and-float animation so each subject gets its own animated wordmark.

## Requirements

### Requirement: Pixel wordmark renders arbitrary short labels
`PixelLogo` SHALL accept a `text` prop and render each character from a pixel-font glyph map covering A–Z, 0–9, hyphen, and space. It SHALL emit the same `<rect>` structure the existing GSAP animation targets, preserving the random-stagger reveal and float.

#### Scenario: Renders a subject label
- **WHEN** `PixelLogo` is given `text="DP-750"`
- **THEN** it SHALL render the pixel glyphs for D, P, hyphen, 7, 5, 0

#### Scenario: Renders a different label
- **WHEN** `PixelLogo` is given a different supported label
- **THEN** it SHALL render that label's glyphs using the same font and animation

#### Scenario: Animation still applies
- **WHEN** `PixelLogo` renders with `animated` enabled
- **THEN** the reveal stagger and float animation SHALL run over the emitted `rect` elements

#### Scenario: Reveal is resilient to remounts
- **WHEN** the component is mounted, unmounted, and remounted (as under React StrictMode)
- **THEN** all glyph pixels SHALL end fully visible (no pixels stuck at opacity 0)

### Requirement: Short labels are restricted to supported glyphs
`Subject.shortLabel` SHALL be validated at load to contain only characters present in the glyph map. Unsupported characters SHALL fail validation.

#### Scenario: Supported label passes
- **WHEN** a subject has `shortLabel` "AZ-900"
- **THEN** the subject SHALL load

#### Scenario: Unsupported glyph fails
- **WHEN** a subject `shortLabel` contains a character with no glyph
- **THEN** loading SHALL fail with a clear error
