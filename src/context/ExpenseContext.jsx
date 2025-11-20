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
            console.log('[Notification] Enabled:', enabled);
            if (!enabled) return;

            const time = localStorage.getItem('notificationTime') || '09:00';
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;


            console.log('[Notification] Current time:', currentTime, 'Target time:', time);

            // Check if we're at the target time
            const [targetHour, targetMin] = time.split(':').map(Number);
            const currentHour = now.getHours();
            const currentMin = now.getMinutes();

            console.log('[Notification] Target Hour:', targetHour, 'Target Min:', targetMin);
            console.log('[Notification] Current Hour:', currentHour, 'Current Min:', currentMin);

            const isTimeMatch = currentHour === targetHour && currentMin === targetMin;

            console.log('[Notification] Time match:', isTimeMatch, 'Hour match:', currentHour === targetHour, 'Min match:', currentMin === targetMin);

            if (isTimeMatch) {
                const lastNotified = localStorage.getItem('lastNotifiedDate');
                const todayStr = now.toDateString();

                console.log('[Notification] Last notified:', lastNotified, 'Today:', todayStr);

                if (lastNotified !== todayStr) {
                    // Check for expenses today
                    const todayExpenses = expenses.filter(exp => {
                        const d = new Date(exp.date);
                        return d.toDateString() === todayStr && !exp.isPaid;
                    });

                    console.log('[Notification] Today expenses:', todayExpenses.length);

                    if (todayExpenses.length > 0) {
                        const total = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
                        const title = todayExpenses.length === 1 ? todayExpenses[0].title : `${todayExpenses.length} Adet Gider`;

                        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                            console.log('[Notification] Sending notification...');
                            new Notification('Gider Hatırlatması', {
                                body: `Bugün ödemeniz var: ${title} - Toplam: ${total} TL`,
                                icon: '/pwa-192x192.png',
                                tag: 'expense-reminder',
                                requireInteraction: false
                            });
                        } else {
                            console.log('[Notification] Permission not granted');
                        }

                        localStorage.setItem('lastNotifiedDate', todayStr);
                    } else {
                        console.log('[Notification] No unpaid expenses for today');
                    }
                } else {
                    console.log('[Notification] Already notified today');
                }
            }
        };

        // Check immediately on load
        checkNotifications();

        // Check every 10 seconds for more reliable timing
        const interval = setInterval(checkNotifications, 10000);

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
