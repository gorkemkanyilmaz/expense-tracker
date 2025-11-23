export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let data = req.body;

        // Handle Form Data (application/x-www-form-urlencoded)
        // The client sends a field named 'json' containing the stringified data
        if (req.body && typeof req.body.json === 'string') {
            try {
                data = JSON.parse(req.body.json);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid JSON in form data' });
            }
        }

        const { expenses, time, mode } = data; // mode: 'publish' or 'cancel'

        if (!expenses || !Array.isArray(expenses)) {
            return res.status(400).json({ error: 'Invalid expenses data' });
        }

        const [hour, minute] = (time || '09:00').split(':');

        const events = expenses.map(expense => {
            const [year, month, day] = expense.date.split('-');
            const startDate = `${year}${month}${day}T${hour}${minute}00`;

            const eventParts = [
                'BEGIN:VEVENT',
                `UID:${expense.id}@expense-tracker`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`,
                `DTSTART:${startDate}`,
                'DURATION:PT1H',
                `SUMMARY:${mode === 'cancel' ? 'CANCELLED' : `${expense.title} - ${expense.amount} ${expense.currency}`}`,
                `DESCRIPTION:${mode === 'cancel' ? 'Cancelled' : `Kategori: ${expense.category}\\nÖdeme Hatırlatması`}`,
                `SEQUENCE:${mode === 'cancel' ? '1' : '0'}`,
                `STATUS:${mode === 'cancel' ? 'CANCELLED' : 'CONFIRMED'}`,
                'TRANSP:OPAQUE',
                'BEGIN:VALARM',
                'TRIGGER:-PT0M',
                'ACTION:DISPLAY',
                'DESCRIPTION:Reminder',
                'END:VALARM',
                'END:VEVENT'
            ];

            return eventParts.join('\r\n');
        }).join('\r\n');

        const calendarContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Expense Tracker//TR',
            'CALSCALE:GREGORIAN',
            `METHOD:${mode === 'cancel' ? 'CANCEL' : 'PUBLISH'}`,
            events,
            'END:VCALENDAR'
        ].join('\r\n');

        const filename = mode === 'cancel'
            ? `sil_${expenses[0].title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`
            : `giderler_${new Date().getTime()}.ics`;

        // Set headers for file download
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(calendarContent);

    } catch (error) {
        console.error('ICS Generation Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
