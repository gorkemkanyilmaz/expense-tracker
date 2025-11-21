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
    const initialCheckDone = React.useRef(false);

    useEffect(() => {
        const checkNotifications = (ignoreTime = false) => {
            try {
                const enabled = localStorage.getItem('notificationsEnabled') === 'true';
                console.log('[Notification] Enabled:', enabled);
                if (!enabled) return;

                const time = localStorage.getItem('notificationTime') || '09:00';
                const now = new Date();
                const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                console.log('[Notification] Current time:', currentTime, 'Target time:', time, 'Ignore Time:', ignoreTime);

                // Check if we're at the target time
                const [targetHour, targetMin] = time.split(':').map(Number);
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();

                const isTimeMatch = currentHour === targetHour && currentMin === targetMin;

                if (isTimeMatch || ignoreTime) {
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
                                try {
                                    // Service Worker registration check for mobile support
                                    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                                        navigator.serviceWorker.ready.then(registration => {
                                            registration.showNotification('Gider Hatırlatması', {
                                                body: `Bugün ödemeniz var: ${title} - Toplam: ${total} TL`,
                                                icon: '/pwa-192x192.png',
                                                tag: 'expense-reminder',
                                                requireInteraction: false
                                            });
                                        });
                                    } else {
                                        // Fallback for desktop/simple notification
                                        new Notification('Gider Hatırlatması', {
                                            body: `Bugün ödemeniz var: ${title} - Toplam: ${total} TL`,
                                            icon: '/pwa-192x192.png',
                                            tag: 'expense-reminder',
                                            requireInteraction: false
                                        });
                                    }

                                    // Update last notified date ONLY if notification was sent
                                    localStorage.setItem('lastNotifiedDate', todayStr);
                                } catch (err) {
                                    console.error('[Notification] Error sending notification:', err);
                                }
                            } else {
                                console.log('[Notification] Permission not granted');
                            }
                        } else {
                            console.log('[Notification] No unpaid expenses for today');
                        }
                    } else {
                        console.log('[Notification] Already notified today');
                    }
                }
            } catch (error) {
                console.error('[Notification] Error in checkNotifications:', error);
            }
        };

        // Check immediately on load (ignoring time) if this is the first load and we have expenses
        // Added delay to ensure app is fully ready
        if (!initialCheckDone.current && expenses.length > 0) {
            console.log('[Notification] Scheduling initial check on launch...');
            setTimeout(() => {
                console.log('[Notification] Performing initial check now.');
                checkNotifications(true); // Ignore time, check immediately
                initialCheckDone.current = true;
            }, 2000);
        }

        // Check every 10 seconds for scheduled time
        const interval = setInterval(() => {
            checkNotifications(false); // Respect time
        }, 10000);

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
            const startDay = startDate.getDate();

            for (let i = 1; i < recurrenceDuration; i++) {
                const nextDate = new Date(startDate);
                nextDate.setMonth(startDate.getMonth() + i);

                // Check for month overflow (e.g., Jan 31 -> Feb 28/29)
                // If the day is different from the start day, it means we overflowed
                if (nextDate.getDate() !== startDay) {
                    // Set to the last day of the previous month (which is the target month)
                    nextDate.setDate(0);
                }

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
