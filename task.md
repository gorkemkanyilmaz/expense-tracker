# Task: Robust iOS Calendar Integration

- [ ] Check `package.json` for existing libraries. <!-- id: 0 -->
- [ ] Research/Design the most compatible iOS PWA calendar method (Data URI vs Blob). <!-- id: 1 -->
- [ ] Create `implementation_plan.md`. <!-- id: 2 -->
- [ ] Update `calendar.js`:
    - [ ] Implement Data URI strategy for iOS (bypasses Blob download issues). <!-- id: 3 -->
    - [ ] Ensure `window.open` targets `_blank` to escape PWA strict mode if needed. <!-- id: 4 -->
    - [ ] Refine ICS content (Timezones, UUIDs). <!-- id: 5 -->
- [ ] Verify build. <!-- id: 6 -->
- [ ] Push to git. <!-- id: 7 -->
