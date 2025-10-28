const BASE_URL = 'http://localhost:4000';

/**
 * Fetches the list of available templates from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of template objects.
 */
export async function fetchTemplates() {
    try {
        const response = await fetch(`${BASE_URL}/l`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
}

/**
 * Sends the invoice data to the backend API.
 * @param {object} payload The invoice data payload.
 * @returns {Promise<object>} The JSON response from the server.
 */
export async function generateInvoice(payload) {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Try to get a JSON error message from the server, otherwise fall back to status text
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
        }

        // If 'dl' is specified, return the raw response for blob processing in the UI.
        // Otherwise, parse as JSON.
        if (payload.sendType === 'dl') {
            return response;
        }
        return response.json();

    } catch (error) {
        console.error('Error in generateInvoice:', error);
        throw error;
    }
}