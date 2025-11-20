import React, { createContext, useState, useEffect, useContext } from 'react';
import { StorageService } from '../services/storage';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const loadedExpenses = StorageService.loadExpenses();
        setExpenses(loadedExpenses);
    }, []);

    useEffect(() => {
        StorageService.saveExpenses(expenses);
    }, [expenses]);

    // Notification Logic
    useEffect(() => {
        const checkNotifications = () => {
            const enabled = localStorage.getItem('notificationsEnabled') === 'true';
            if (!enabled) return;

            const time = localStorage.getItem('notificationTime') || '09:00';
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            if (currentTime === time) {
                const lastNotified = localStorage.getItem('lastNotifiedDate');
                const todayStr = now.toDateString();

                if (lastNotified !== todayStr) {
                    // Check for expenses today
                    const todayExpenses = expenses.filter(exp => {
                        const d = new Date(exp.date);
                        return d.toDateString() === todayStr && !exp.isPaid;
                    });

                    if (todayExpenses.length > 0) {
                        const total = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
                        const title = todayExpenses.length === 1 ? todayExpenses[0].title : `${todayExpenses.length} Adet Gider`;

                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            new Notification('Gider Hatırlatması', {
                                body: `Bugün ödemeniz var: ${title} - Toplam: ${total} TL`,
                                icon: '/vite.svg' // Placeholder icon
                            });
                        }

                        localStorage.setItem('lastNotifiedDate', todayStr);
                    }
                }
            }
        };

        const interval = setInterval(checkNotifications, 60000); // Check every minute
        // Also check immediately on load/change
        // checkNotifications(); 

        return () => clearInterval(interval);
    }, [expenses]);

    const addExpense = (expenseData) => {
        const newExpenses = [];
        const {
            amount,
            currency,
            category,
            title,
            date,
            isRecurring,
            recurrenceDuration
        } = expenseData;

        const startDate = new Date(date);

        // Helper for ID generation
        const generateId = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        };

        // Create the first expense
        newExpenses.push({
            id: generateId(),
            date: startDate.toISOString(),
            amount: parseFloat(amount),
            currency,
            category,
            title,
            isRecurring,
            recurrenceId: isRecurring ? generateId() : null,
            isPaid: false
        });

        // Handle recurrence
        if (isRecurring && recurrenceDuration > 1) {
            const recurrenceId = newExpenses[0].recurrenceId;

            for (let i = 1; i < recurrenceDuration; i++) {
                const nextDate = new Date(startDate);
                nextDate.setMonth(startDate.getMonth() + i);

                newExpenses.push({
                    id: generateId(),
                    date: nextDate.toISOString(),
                    amount: parseFloat(amount),
                    currency,
                    category,
                    title,
                    isRecurring: true,
                    recurrenceId: recurrenceId,
                    isPaid: false
                });
            }
        }

        setExpenses(prev => [...prev, ...newExpenses]);
    };

    const deleteExpense = (id) => {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
    };

    const updateExpense = (id, updatedData) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, ...updatedData } : exp
        ));
    };

    const markAsPaid = (id) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, isPaid: true } : exp
        ));
    };

    const getExpensesByMonth = (year, month) => {
        return expenses.filter(exp => {
            const d = new Date(exp.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
    };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            addExpense,
            updateExpense,
            deleteExpense,
            markAsPaid,
            getExpensesByMonth
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
