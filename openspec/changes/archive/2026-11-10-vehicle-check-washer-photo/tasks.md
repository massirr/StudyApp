## 1. Photo
- [x] 1.1 Download "Opel Corsa-e engine bay seen from top.jpg" (Harald Linden, CC BY-SA 4.0) from Wikimedia Commons; confirm author and licence on the file page (checked through the Commons API: author Harald Linden, licence CC BY-SA 4.0, 3944 × 2637; used the 1920 px rendition)
- [x] 1.2 Crop to the washer cap and coolant reservoir, resize to at most 1200 px wide (840 × 750)
- [x] 1.3 Draw marker 5 on the washer cap in the style of `engine-bay-photo.jpg`; save as `public/images/vehicle-check/washer-cap-photo.jpg` (150 KB; the leader dot sits at the lower right of the cap so the windscreen-washer symbol stays visible)
- [x] 1.4 Check legibility at full size and at 400 px wide

## 2. Update the subject
- [x] 2.1 `q-45`: new `image` (src and alt), explanation with credit, Commons File: URL in `sourceUrls`
- [x] 2.2 Add the photo to `sources` (`src-photo-4`) with licence URL in `usageNote`
- [x] 2.3 `content/vehicle-check/photo-credits.md`: add the row, fix the "number 5 has no marker" notes, add the attribution and share-alike note
- [x] 2.4 Delete `public/images/vehicle-check/engine-bay.svg` after grep shows no remaining reference (only docs mentioned it)

## 3. Verify
- [x] 3.1 `npm run test:unit` (155/155 pass; with the credit removed from `q-45` the credit test fails, so it does cover it)
- [x] 3.2 `npm run lint` and `npm run build` (build passes; lint reports the same 24 `no-explicit-any` errors in `mcp/` files before and after this change)
- [x] 3.3 View the quiz at phone width and check the `q-45` image loads (Playwright, 390 px, question 4 of 31 shows `washer-cap-photo.jpg` at 840 × 750)
- [x] 3.4 Archive with `openspec archive vehicle-check-washer-photo`
