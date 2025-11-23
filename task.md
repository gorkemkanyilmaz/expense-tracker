# Task: Fix Calendar Issues

- [ ] Update `calendar.js`:
    - [ ] Remove `FileReader` hack (fixes "Invitation" prompt). <!-- id: 0 -->
    - [ ] Use `DURATION:PT1H` instead of `DTEND` (fixes hour overflow). <!-- id: 1 -->
    - [ ] Parse date strings manually (fixes timezone issues). <!-- id: 2 -->
    - [ ] Ensure `UID` is clean. <!-- id: 3 -->
- [ ] Verify build. <!-- id: 4 -->
- [ ] Push to git. <!-- id: 5 -->
