# Task: Server-Side ICS Generation

- [ ] Create `api` directory. <!-- id: 0 -->
- [ ] Create `api/generate-ics.js`:
    - [ ] Handle POST requests. <!-- id: 1 -->
    - [ ] Parse expense data. <!-- id: 2 -->
    - [ ] Generate ICS content (reuse logic). <!-- id: 3 -->
    - [ ] Set headers: `Content-Type: text/calendar`, `Content-Disposition: attachment`. <!-- id: 4 -->
- [ ] Update `calendar.js`:
    - [ ] Remove client-side blob logic. <!-- id: 5 -->
    - [ ] Implement Form POST submission to `/api/generate-ics`. <!-- id: 6 -->
    - [ ] Handle local dev environment (warn or fallback?). <!-- id: 7 -->
- [ ] Verify build. <!-- id: 8 -->
- [ ] Push to git. <!-- id: 9 -->
