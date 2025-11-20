export const CalendarService = {
    downloadICS: (expense) => {
        const date = new Date(expense.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Set time to 09:00 for the reminder
        const startDate = `${year}${month}${day}T090000`;
        const endDate = `${year}${month}${day}T100000`;

        const event = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `SUMMARY:${expense.title} - ${expense.amount} ${expense.currency}`,
            `DESCRIPTION:Kategori: ${expense.category}\\nÖdeme Hatırlatması`,
            'BEGIN:VALARM',
            'TRIGGER:-PT15M',
            'ACTION:DISPLAY',
            'DESCRIPTION:Reminder',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${expense.title.replace(/\s+/g, '_')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
