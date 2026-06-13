# DP-750 Quiz UI Design Specification
## 21st-dev/Magic Design System

**Date:** 2026-06-11  
**Status:** Approved for Implementation  
**Design System:** 21st-dev/magic (dark mode + modern typography)

---

## 1. Design Goals (Priority Order)

1. **Readability & Clarity** – Clean, uncluttered, scannable interface
2. **Modern & Polished** – Contemporary visual language with confidence
3. **Professional Tone** – Exam-focused, serious preparation atmosphere
4. **Engaging Interactions** – Smooth transitions, answer reveals, progress feedback

---

## 2. Design Tokens

### Color Palette (Dark Mode)
- **Background:** `#0f1419` (dark neutral)
- **Surface:** `#1a1f26` (card/container background)
- **Text Primary:** `#e4e6eb` (high contrast white)
- **Text Secondary:** `#9ca3af` (muted gray)
- **Accent:** `#3b82f6` (modern blue for interactions)
- **Success:** `#10b981` (green for correct answers)
- **Error:** `#ef4444` (red for incorrect/warnings)
- **Border:** `#374151` (subtle divider)

### Typography
- **Font Family:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Heading (Question):** 18px, 600 weight, 1.4 line-height, primary text
- **Body Text:** 15px, 400 weight, 1.6 line-height, primary text
- **Label (Options):** 14px, 500 weight, secondary text
- **Meta (Feedback/Source):** 13px, 400 weight, secondary text

### Spacing Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `2xl`: 32px

### Shadows
- **Subtle:** `0 1px 3px rgba(0,0,0,0.2)`
- **Medium:** `0 4px 12px rgba(0,0,0,0.3)`
- **Focus Ring:** `0 0 0 3px rgba(59,130,246,0.3)` (blue accent with alpha)

---

## 3. Component Structure

### 3.1 QuizPage Layout
```
┌─────────────────────────────────────┐
│  QuizHeader (topic, progress)       │
├─────────────────────────────────────┤
│                                     │
│  QuestionDisplay                    │
│  (scenario + question text)         │
│                                     │
│  AnswerPicker                       │
│  (single or multiple options)       │
│                                     │
│  FeedbackPanel (conditional)        │
│  (explanation + source links)       │
│                                     │
├─────────────────────────────────────┤
│  QuizNav (Previous, Next buttons)   │
└─────────────────────────────────────┘
```

### 3.2 QuestionDisplay Component
- **Container:** Full width, padding `lg` top/bottom, `xl` left/right
- **Scenario Tag (if present):** Small badge, accent color, rounded corners, `sm` padding
- **Question Text:** Heading style, margin-bottom `lg`
- **Visual Treatment:** All text on dark background, high contrast for readability

### 3.3 AnswerPicker Component
- **Container:** Vertical stack (flexbox), gap `md` between options
- **Answer Option (Card):**
  - Background: surface color
  - Border: `1px solid border-color`
  - Border-radius: `6px`
  - Padding: `md` (all sides)
  - Cursor: pointer
  
- **Option States:**
  - **Idle:** Border subtle, text secondary-gray
  - **Hover:** Border brightens to accent-blue, background slightly lighter
  - **Selected (pre-submit):** Border accent-blue, background tinted with accent (10% opacity)
  - **Submitted (locked):**
    - Correct: Border green, background green (5% opacity), text primary
    - Incorrect: Border red, background red (5% opacity), text primary
    - Unselected-locked: Border/text grayed out
  
- **Checkbox/Radio Indicator:**
  - Size: 18px × 18px
  - Border: 2px solid current-border-color
  - Background: transparent
  - On-select: filled with accent color, checkmark white

### 3.4 FeedbackPanel Component
- **Visibility:** Shown after answer submission only
- **Container:** Separated from answer picker, margin-top `xl`
- **Structure:**
  - **Title:** "Explanation" (optional, muted text)
  - **Explanation Text:** Primary text, margin-bottom `md`
  - **Source Links:** List of official Microsoft sources, styled as inline links (accent blue)
  - **Visual Separator:** Subtle border-top between explanation and sources
- **Animation:** Fade-in from opacity 0 → 1 over 300ms

### 3.5 QuizHeader Component
- **Layout:** Horizontal flex, space-between
- **Left Side:** Topic name (secondary text), current question count (primary text)
- **Right Side:** Progress bar (optional) or badge showing completion %
- **Styling:** Padding `lg`, border-bottom subtle

### 3.6 QuizNav Component
- **Layout:** Horizontal flex, space-between
- **Buttons:**
  - Previous: Secondary style (outline), disabled on first question
  - Next: Primary style (filled accent), disabled until feedback shown
- **Button States:**
  - **Disabled:** Opacity 0.5, cursor not-allowed
  - **Enabled-Idle:** Accent background, white text
  - **Enabled-Hover:** Slightly darker accent, shadow medium
  - **Focus:** Outline/ring with focus color

---

## 4. Interaction Flows

### 4.1 Answer Selection (Pre-Submit)
1. User hovers over option → subtle highlight
2. User clicks option → card highlights with accent border + tinted background
3. Visual feedback: smooth transition (150ms)
4. User can click another option to change selection (previous deselects)
5. Submit button becomes enabled

### 4.2 Answer Submission
1. User clicks Submit (or next automatically after delay)
2. All answer options become locked (visual state change)
3. Correct answer: Green border + green background tint
4. Incorrect answer (if user selected): Red border + red background tint
5. Unselected options: Grayed out
6. Feedback panel fades in with explanation
7. Next button enabled after 500ms

### 4.3 Navigation
1. On question submit, Next button becomes enabled
2. On click Next → fade out current question, fade in next question (300ms total)
3. Previous button restores last answer state from localStorage
4. Progress updates in header

---

## 5. Accessibility Requirements

### Keyboard Navigation
- `Tab` / `Shift+Tab`: Navigate through focusable elements
- `Space` / `Enter`: Select answer option
- Focus indicators: Visible 3px ring with accent color (high contrast)

### Screen Reader Support
- Answer options: `role="radio"` with `aria-checked`
- Feedback panel: `role="region" aria-live="polite"` for dynamic updates
- Source links: Clear, descriptive link text (not just "source")

### Color Contrast
- All text on dark background: WCAG AAA (contrast ratio ≥ 7:1)
- Focus indicators: Blue ring on dark = ≥ 3:1 contrast

### Mobile Responsiveness
- Touch targets: Minimum 44px × 44px
- Answer cards: Stack vertically on screens < 640px
- Padding/spacing: Adjusted for smaller screens (slightly reduced)

---

## 6. Animations & Transitions

### Global Defaults
- **Standard transition:** 150ms ease-in-out
- **Staggered list:** 100ms delay between items
- **Feedback panel:** 300ms fade-in

### Specific Animations
| Element | Trigger | Animation |
|---------|---------|-----------|
| Answer option | hover | Border/background color shift (150ms) |
| Answer card | selection | Subtle scale (0.98→1.0, 150ms) + border change |
| Feedback panel | submit | Fade-in (0→1, 300ms) |
| Page transition | next/prev | Fade out question + fade in new (300ms) |
| Progress indicator | update | Smooth width transition (400ms) |

---

## 7. Component Implementation Map

| Component | File | Responsibility |
|-----------|------|-----------------|
| QuizPage | `src/components/quiz/QuizPage.tsx` | Main layout, state orchestration |
| QuestionDisplay | `src/components/quiz/QuestionDisplay.tsx` | Render question + scenario |
| AnswerPicker | `src/components/quiz/AnswerPicker.tsx` | Render answer options, handle selection |
| FeedbackPanel | `src/components/quiz/FeedbackPanel.tsx` | Render explanation + sources |
| QuizHeader | `src/components/quiz/QuizHeader.tsx` | Progress info |
| QuizNav | `src/components/quiz/QuizNav.tsx` | Navigation controls |

CSS Modules:
- `QuestionDisplay.module.css`
- `AnswerPicker.module.css`
- `FeedbackPanel.module.css`
- `QuizHeader.module.css`
- `QuizNav.module.css`
- `QuizPage.module.css` (shared layout styles)

---

## 8. Acceptance Criteria

- [ ] Dark mode background and text colors applied across all quiz components
- [ ] Answer option states (idle, hover, selected, submitted) visually distinct
- [ ] Feedback panel appears after submission with explanation + source links
- [ ] Answer selection prevents submission until an option is selected
- [ ] Navigation buttons (Previous/Next) enable/disable correctly
- [ ] Keyboard navigation works: Tab, Space/Enter, focus visible
- [ ] All text meets WCAG AAA contrast ratio on dark background
- [ ] Animations smooth and under 300ms
- [ ] No console errors or TypeScript errors
- [ ] Playwright tests pass (E2E quiz flow)
- [ ] Build succeeds with optimized output

---

## 9. Success Metrics

✅ **Visual:** Professional, modern appearance with dark mode  
✅ **UX:** Clear interaction states, smooth transitions, accessible  
✅ **Code:** No new dependencies, uses existing CSS Modules pattern  
✅ **Performance:** Build size stable, animations 60fps  
✅ **Testing:** 4/4 Playwright tests pass, no regressions
