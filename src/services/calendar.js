export const CalendarService = {
    addToCalendar: (expenses, time = '09:00') => {
        if (!expenses || expenses.length === 0) return;

        const [hour, minute] = time.split(':');

        const events = expenses.map(expense => {
            const date = new Date(expense.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const startDate = `${year}${month}${day}T${hour}${minute}00`;
            // End date is 1 hour later
            let endHour = parseInt(hour) + 1;
            const endDate = `${year}${month}${day}T${String(endHour).padStart(2, '0')}${minute}00`;

            return [
                'BEGIN:VEVENT',
                `UID:${expense.id}@expense-tracker`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`,
                `DTSTART:${startDate}`,
                `DTEND:${endDate}`,
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

        // We need to reconstruct the start time to match the original event
        // Defaulting to 09:00 if not stored, but ideally should match what was used to create it.
        // Since we don't store the specific time used for creation on the expense object, 
        // we use the current setting or default. 
        // Note: For strict matching, DTSTART is often required.
        const time = localStorage.getItem('notificationTime') || '09:00';
        const [hour, minute] = time.split(':');

        const date = new Date(expense.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
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
        // iOS Safari workaround for Blob downloads
        if (navigator.userAgent.match('CriOS') || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                window.location.href = reader.result;
            };
            reader.readAsDataURL(blob);
        } else {
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
    }
};
