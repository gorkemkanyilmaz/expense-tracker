# Task: Fix iOS Calendar Cancellation Issues

- [ ] Analyze `calendar.js` for missing required fields in cancellation event <!-- id: 0 -->
- [ ] Update `removeFromCalendar` to include `DTSTART` (required for matching events) <!-- id: 1 -->
- [ ] Sanitize filenames to ensure iOS compatibility (ASCII only) <!-- id: 2 -->
- [ ] Add `SEQUENCE` number to events to ensure updates are processed <!-- id: 3 -->
- [ ] Verify `addToCalendar` also follows best practices for updates <!-- id: 4 -->
- [ ] Test build <!-- id: 5 -->
