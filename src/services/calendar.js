export const CalendarService = {
    addToCalendar: (expenses, time = '09:00') => {
        if (!expenses || expenses.length === 0) return;

        const [hour, minute] = time.split(':');

        const events = expenses.map(expense => {
            // Parse date manually to avoid timezone issues
            // expense.date is YYYY-MM-DD
            const [year, month, day] = expense.date.split('-');

            const startDate = `${year}${month}${day}T${hour}${minute}00`;

            return [
                'BEGIN:VEVENT',
                `UID:${expense.id}@expense-tracker`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`,
                `DTSTART:${startDate}`,
                'DURATION:PT1H', // Use Duration instead of DTEND to avoid day overflow issues
                `SUMMARY:${expense.title} - ${expense.amount} ${expense.currency}`,
                `DESCRIPTION:Kategori: ${expense.category}\\nÖdeme Hatırlatması`,
                'SEQUENCE:0',
                'STATUS:CONFIRMED',
                'TRANSP:OPAQUE',
                'BEGIN:VALARM',
                'TRIGGER:-PT0M',
                'ACTION:DISPLAY',
                'DESCRIPTION:Reminder',
                'END:VALARM',
                'END:VEVENT'
            ].join('\n');
        }).join('\n');

        const calendarContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Expense Tracker//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            events,
            'END:VCALENDAR'
        ].join('\n');

        CalendarService.downloadFile(calendarContent, `giderler_${new Date().getTime()}.ics`);
    },

    removeFromCalendar: (expense) => {
        if (!expense) return;

        const time = localStorage.getItem('notificationTime') || '09:00';
        const [hour, minute] = time.split(':');

        // Parse date manually
        const [year, month, day] = expense.date.split('-');
        const startDate = `${year}${month}${day}T${hour}${minute}00`;

        const event = [
            'BEGIN:VEVENT',
            `UID:${expense.id}@expense-tracker`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`,
            `DTSTART:${startDate}`,
            'SEQUENCE:1',
            'STATUS:CANCELLED',
            'SUMMARY:CANCELLED',
            'TRANSP:TRANSPARENT',
            'END:VEVENT'
        ].join('\n');

        const calendarContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Expense Tracker//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:CANCEL',
            event,
            'END:VCALENDAR'
        ].join('\n');

        // Sanitize filename for iOS: only alphanumeric and underscores
        const safeTitle = expense.title.replace(/[^a-zA-Z0-9]/g, '_');
        CalendarService.downloadFile(calendarContent, `sil_${safeTitle}.ics`);
    },

    downloadFile: (content, filename) => {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }, 100);
    }
};
