# Implementation Plan - Robust iOS Calendar Integration

## Problem
iOS Safari (especially in PWA mode) has strict security policies that block Blob URL downloads and sometimes `navigator.share` with files. The user experiences "Safari cannot download" errors.

## Solution
We will switch to a **Data URI** approach for iOS. This embeds the file content directly in the URL, which Safari handles natively by opening the Calendar preview, bypassing the filesystem/download manager.

## Proposed Changes

### `src/services/calendar.js`
- **Detect iOS**: Robustly detect iOS/iPadOS.
- **Data URI Generation**: Convert the ICS content to a base64 Data URI (`data:text/calendar;base64,...`).
- **Window Open**: Use `window.open(dataUri, '_blank')` for iOS. This forces the OS to handle the protocol/MIME type.
- **Desktop Fallback**: Keep the Anchor tag download for desktop.
- **ICS Refinement**:
    - Ensure `PRODID` is unique/valid.
    - Ensure `UID` is persistent and valid.
    - Use `CRLF` strictly.

## Verification
- **Manual Test**: Since I cannot test on a real iPhone, I will rely on the known behavior of Data URIs on iOS.
- **Build**: Ensure `npm run build` passes.
