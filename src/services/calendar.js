export const CalendarService = {
    addToCalendar: (expenses, time = '09:00') => {
        CalendarService.downloadFromApi(expenses, time, 'publish');
    },

    removeFromCalendar: (expense) => {
        CalendarService.downloadFromApi([expense], null, 'cancel');
    },

    downloadFromApi: (expenses, time, mode) => {
        // Use a hidden form to POST data to the API and trigger a download
        // This is the most robust way to handle file downloads in iOS PWAs
        // as it navigates the "frame" to the file, which the OS handles.

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/api/generate-ics';
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data'; // We'll send it as JSON string in body, but forms send key-value
        // Actually, for JSON body we need fetch, but fetch can't trigger download easily on iOS.
        // So we'll use fetch to get the blob? No, blob is the problem.
        // We need the browser to navigate to the response.

        // Correction: Standard HTML forms send application/x-www-form-urlencoded.
        // We need to adjust the API to handle that OR send JSON via fetch and handle blob (which fails).
        // Best bet: Send JSON as a string in a form field, parse it on server.

        // Let's adjust the API to handle JSON body (which Vercel does automatically) 
        // BUT standard form post sends content-type application/json.
        // HTML Forms don't send application/json.
        // So we will use the 'fetch' approach but with a twist? No.

        // The ONLY way to bypass the sandbox is a direct navigation.
        // So form submit is correct.
        // We will send the data as a JSON string in a field named 'json'.

        // Let's update the API to handle this first? 
        // Actually, Vercel functions handle JSON body if Content-Type is application/json.
        // HTML Forms don't send application/json.
        // So we will use the 'fetch' approach but with a twist? No.

        // Let's stick to the form. We will send the data as a JSON string in a hidden input.
        // We need to update the API to check for this.
        // But wait, I can't update the API easily now without another step.

        // BETTER IDEA:
        // Use `fetch` to send the data, get a short-lived "download token" or URL? Too complex.

        // Let's just use the form and send the data as JSON string.
        // I will update the API in the next step to handle form data or JSON string.
        // Actually, I can just send the fields as inputs?
        // expenses is an array, complex to map to inputs.

        // Let's use the JSON string approach.
        // Input name="json" value={JSON.stringify({ expenses, time, mode })}

        const jsonInput = document.createElement('input');
        jsonInput.type = 'hidden';
        jsonInput.name = 'json';
        jsonInput.value = JSON.stringify({ expenses, time, mode });
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
};
