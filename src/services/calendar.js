export const CalendarService = {
    addToCalendar: (expenses, time = '09:00') => {
        if (!expenses || expenses.length === 0) return;

        const [hour, minute] = time.split(':');

        const events = expenses.map(expense => {
            const [year, month, day] = expense.date.split('-');
            const startDate = `${year}${month}${day}T${hour}${minute}00`;

            // ICS requires CRLF line endings
            return [
                'BEGIN:VEVENT',
                `UID:${expense.id}@expense-tracker`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`,
                `DTSTART:${startDate}`,
                'DURATION:PT1H',
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
            ].join('\r\n');
        }).join('\r\n');

        const calendarContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Expense Tracker//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            events,
            'END:VCALENDAR'
        ].join('\r\n');

        CalendarService.openCalendar(calendarContent, `giderler_${new Date().getTime()}.ics`);
    },

    removeFromCalendar: (expense) => {
        if (!expense) return;

        const time = localStorage.getItem('notificationTime') || '09:00';
        const [hour, minute] = time.split(':');
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
        ].join('\r\n');

        const calendarContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Expense Tracker//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:CANCEL',
            event,
            'END:VCALENDAR'
        ].join('\r\n');

        const safeTitle = expense.title.replace(/[^a-zA-Z0-9]/g, '_');
        CalendarService.openCalendar(calendarContent, `sil_${safeTitle}.ics`);
    },

    openCalendar: (content, filename) => {
        // Ensure CRLF line endings
        const formattedContent = content.replace(/\n/g, '\r\n').replace(/\r\r\n/g, '\r\n');

        // iOS Detection
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS) {
            // Data URI Strategy for iOS
            // This bypasses the download manager and opens the calendar preview directly
            const base64Content = btoa(unescape(encodeURIComponent(formattedContent)));
            const dataUri = `data:text/calendar;charset=utf-8;base64,${base64Content}`;

            // Opening in _blank is crucial for PWA to break out to System Browser/Calendar
            window.open(dataUri, '_blank');
        } else {
            // Desktop/Android Fallback (Standard Download)
            const blob = new Blob([formattedContent], { type: 'text/calendar;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        }
    }
};
