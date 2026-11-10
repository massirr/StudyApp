## 1. Photo
- [ ] 1.1 Download "Opel Corsa-e engine bay seen from top.jpg" (Harald Linden, CC BY-SA 4.0) from Wikimedia Commons; confirm author and licence on the file page
- [ ] 1.2 Crop to the washer cap and coolant reservoir, resize to at most 1200 px wide
- [ ] 1.3 Draw marker 5 on the washer cap in the style of `engine-bay-photo.jpg`; save as `public/images/vehicle-check/washer-cap-photo.jpg` (under ~250 KB)
- [ ] 1.4 Check legibility at full size and at 400 px wide

## 2. Update the subject
- [ ] 2.1 `q-45`: new `image` (src and alt), explanation with credit, Commons File: URL in `sourceUrls`
- [ ] 2.2 Add the photo to `sources` (`src-photo-4`) with licence URL in `usageNote`
- [ ] 2.3 `content/vehicle-check/photo-credits.md`: add the row, fix the "number 5 has no marker" notes, add the attribution and share-alike note
- [ ] 2.4 Delete `public/images/vehicle-check/engine-bay.svg` after grep shows no remaining reference

## 3. Verify
- [ ] 3.1 `npm run test:unit` (credit test must now cover `q-45`)
- [ ] 3.2 `npm run lint` and `npm run build`
- [ ] 3.3 View the quiz at phone width and check the `q-45` image loads
- [ ] 3.4 Archive with `openspec archive vehicle-check-washer-photo`
