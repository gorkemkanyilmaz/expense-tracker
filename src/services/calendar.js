/**
 * Calendar Service - Client-Side ICS File Generation
 * Generates .ics calendar files directly in the browser for iOS compatibility
 */
export const CalendarService = {
    /**
     * Add expenses to calendar by generating and downloading an ICS file
     * @param {Array} expenses - Array of expense objects to add
     * @param {string} time - Time in HH:MM format (default: '09:00')
     */
    addToCalendar: (expenses, time = '09:00') => {
        try {
            const icsContent = CalendarService.generateICS(expenses, time, 'PUBLISH');
            const filename = `giderler_${new Date().getTime()}.ics`;
            CalendarService.downloadICS(icsContent, filename);
        } catch (error) {
            console.error('Calendar add error:', error);
            alert('Takvime eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    },

    /**
     * Remove expense from calendar by generating a cancellation ICS file
     * @param {Object} expense - Expense object to remove
     * @param {string} time - Time in HH:MM format (must match original event time)
     */
    removeFromCalendar: (expense, time = '09:00') => {
        try {
            const icsContent = CalendarService.generateICS([expense], time, 'CANCEL');
            const filename = `sil_${expense.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
            CalendarService.downloadICS(icsContent, filename);
        } catch (error) {
            console.error('Calendar remove error:', error);
            alert('Takvimden silinirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    },

    /**
     * Generate ICS file content
     * @param {Array} expenses - Array of expenses
     * @param {string} time - Time in HH:MM format
     * @param {string} method - 'PUBLISH' or 'CANCEL'
     * @returns {string} ICS file content
     */
    generateICS: (expenses, time, method) => {
        const [hour = '09', minute = '00'] = (time || '09:00').split(':');

        const events = expenses.map(expense => {
            // Parse date from ISO string or YYYY-MM-DD format
            const dateObj = new Date(expense.date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');

            // Format: YYYYMMDDTHHMMSS (local time, no Z)
            const startDate = `${year}${month}${day}T${hour}${minute}00`;

            // Generate DTSTAMP (current time in UTC)
            const now = new Date();
            const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            // CRITICAL: SUMMARY must be IDENTICAL for cancellation to work
            // Calendar apps match events by UID + DTSTART + SUMMARY
            const summary = `${expense.title} - ${expense.amount} ${expense.currency}`;
            const description = `Kategori: ${expense.category}\\nÖdeme Hatırlatması`;

            const eventLines = [
                'BEGIN:VEVENT',
                `UID:${expense.id}@expense-tracker`,
                `DTSTAMP:${dtstamp}`,
                `DTSTART:${startDate}`,
                'DURATION:PT1H',
                `SUMMARY:${summary}`,
                `DESCRIPTION:${description}`,
                `SEQUENCE:${method === 'CANCEL' ? '1' : '0'}`,
                `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
                'TRANSP:OPAQUE'
            ];

            // Add alarm for non-cancelled events
            if (method !== 'CANCEL') {
                eventLines.push(
                    'BEGIN:VALARM',
                    'TRIGGER:-PT0M',
                    'ACTION:DISPLAY',
                    'DESCRIPTION:Reminder',
                    'END:VALARM'
                );
            }

            eventLines.push('END:VEVENT');
            return eventLines.join('\r\n');
        }).join('\r\n');

        const calendarLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Expense Tracker//TR',
            'CALSCALE:GREGORIAN',
            `METHOD:${method}`,
            events,
            'END:VCALENDAR'
        ];

        return calendarLines.join('\r\n');
    },

    /**
     * Download ICS file using iOS-compatible method
     * @param {string} content - ICS file content
     * @param {string} filename - Filename for download
     */
    downloadICS: (content, filename) => {
        try {
            // Create blob with proper MIME type for calendar files
            const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // Create temporary anchor element for download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            // Append to body, click, and cleanup
            document.body.appendChild(link);
            link.click();

            // Cleanup after a short delay to ensure download starts
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

        } catch (error) {
            console.error('Download error:', error);
            throw new Error('Dosya indirilemedi');
        }
    }
};
