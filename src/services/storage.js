const STORAGE_KEY = 'expense_tracker_data_v1';

export const StorageService = {
    saveExpenses: (expenses) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        } catch (error) {
            console.error('Error saving expenses:', error);
        }
    },

    loadExpenses: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    },

    clearData: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
