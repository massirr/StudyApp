## 1. Collect photos
- [ ] 1.1 Learner supplies photos of the driving school's car: engine bay (from above, bonnet open), oil dipstick wiped (MIN/MAX visible), coolant reservoir, brake fluid reservoir, washer fluid cap, tyre tread and sidewall with TWI, front and rear with lights on, dashboard controls and warning lights
- [ ] 1.2 For anything missing, pick a freely licensed photo (Wikimedia Commons) and record author, licence and URL in `content/vehicle-check/photo-credits.md`
- [ ] 1.3 Resize to max 1200 px wide, quality 80, under ~250 KB each

## 2. Annotate
- [ ] 2.1 Draw large numbered markers (white outline) on each photo; export flat images to `public/images/vehicle-check/`
- [ ] 2.2 Keep a labelled NL/EN copy per photo outside the app for the learner's gallery
- [ ] 2.3 Check legibility at 400 px wide

## 3. Update the subject
- [ ] 3.1 Point existing questions at the new files and rewrite `alt`
- [ ] 3.2 Update options and explanations where the real car differs from the diagram numbering
- [ ] 3.3 Add new image questions (TWI on sidewall, washer cap symbol, MIN/MAX on real reservoirs)
- [ ] 3.4 Add credits to explanations and `sources` for third-party photos
- [ ] 3.5 Re-check correct-answer letter balance per topic

## 4. Verify
- [ ] 4.1 Extend `vehicle-check.test.ts` to require a credit wherever an image is third-party
- [ ] 4.2 `npm run test:unit` (known: 5 gh-200 distribution failures exist on master and are unrelated)
- [ ] 4.3 `npm run build`
- [ ] 4.4 View the quiz at phone width and check every image loads
- [ ] 4.5 Archive with `openspec archive vehicle-check-real-photos`
