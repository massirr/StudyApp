## 1. Collect photos
- [x] 1.1 Learner supplies photos of the driving school's car: engine bay (from above, bonnet open), oil dipstick wiped (MIN/MAX visible), coolant reservoir, brake fluid reservoir, washer fluid cap, tyre tread and sidewall with TWI, front and rear with lights on, dashboard controls and warning lights (2026-11-04: not done by choice. The learner takes the exam in their own car (M36) and wants to find the parts on it themselves, so the Wikimedia Commons fallback is final)
- [x] 1.2 For anything missing, pick a freely licensed photo (Wikimedia Commons) and record author, licence and URL in `content/vehicle-check/photo-credits.md`
- [x] 1.3 Resize to max 1200 px wide, quality 80, under ~250 KB each (engine bay at quality 65 = 268 KB; TWI crop 279 KB)

## 2. Annotate
- [x] 2.1 Draw large numbered markers (white outline) on each photo; export flat images to `public/images/vehicle-check/`
- [x] 2.2 Keep a labelled NL/EN copy per photo outside the app for the learner's gallery (`content/vehicle-check/gallery/engine-bay-labelled.jpg`; the dipstick and TWI photos have no numbered parts to label)
- [x] 2.3 Check legibility at 400 px wide (TWI photo cropped to the shoulder after the first version was unreadable)

## 3. Update the subject
- [x] 3.1 Point existing questions at the new files and rewrite `alt` (q-42, q-43, q-44, q-46; q-45 washer fluid keeps the SVG because the cap is outside the photo)
- [x] 3.2 Update options and explanations where the real car differs from the diagram numbering (q-43 distractor "5" → "6", since the photo has no marker 5)
- [x] 3.3 Add new image questions (TWI on sidewall, washer cap symbol, MIN/MAX on real reservoirs) (added q-80 dipstick and q-81 TWI; no free photo showed the washer cap symbol or readable MIN/MAX marks, so those were skipped)
- [x] 3.4 Add credits to explanations and `sources` for third-party photos
- [x] 3.5 Re-check correct-answer letter balance per topic (t-4 now 5/5/6/5)

## 4. Verify
- [x] 4.1 Extend `vehicle-check.test.ts` to require a credit wherever an image is third-party
- [x] 4.2 `npm run test:unit` (155/155 pass)
- [x] 4.3 `npm run build`
- [x] 4.4 View the quiz at phone width and check every image loads (Playwright MCP, 390 px: q-42, q-80, q-81)
- [ ] 4.5 Archive with `openspec archive vehicle-check-real-photos`
