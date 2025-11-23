# Task: Fix iOS Calendar Integration

- [ ] Research/Verify iOS Calendar opening methods (Data URI vs Blob URL). <!-- id: 0 -->
- [ ] Create a test HTML file to validate the ICS generation and opening logic locally (if possible) or simulate it. <!-- id: 1 -->
- [ ] Modify `calendar.js`:
    - [ ] Revert `FileReader` data URL approach (likely the cause of "Cannot download"). <!-- id: 2 -->
    - [ ] Try `window.open(blobUrl)` which is often smoother on iOS. <!-- id: 3 -->
    - [ ] Ensure MIME type is exactly `text/calendar`. <!-- id: 4 -->
- [ ] Verify ICS content validity (Validators). <!-- id: 5 -->
- [ ] Push to git only after verification. <!-- id: 6 -->
