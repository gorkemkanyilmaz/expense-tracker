import React, { createContext, useState, useEffect, useContext } from 'react';
import { StorageService } from '../services/storage';
import { CalendarService } from '../services/calendar';

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
        const titleWithCounter = isRecurring && recurrenceDuration > 1
            ? `${title} (1/${recurrenceDuration})`
            : title;

        newExpenses.push({
            id: generateId(),
            date: startDate.toISOString(),
            amount: parseFloat(amount),
            currency,
            category,
            title: titleWithCounter,
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

                // Add counter to title for recurring expenses
                const recurringTitle = `${title} (${i + 1}/${recurrenceDuration})`;

                newExpenses.push({
                    id: generateId(),
                    date: nextDate.toISOString(),
                    amount: parseFloat(amount),
                    currency,
                    category,
                    title: recurringTitle,
                    isRecurring: true,
                    recurrenceId: recurrenceId,
                    isPaid: false
                });
            }
        }

        setExpenses(prev => [...prev, ...newExpenses]);

        // Add to Calendar
        const notificationTime = localStorage.getItem('notificationTime') || '09:00';
        CalendarService.addToCalendar(newExpenses, notificationTime);
    };

    const deleteExpense = (id) => {
        const expenseToDelete = expenses.find(exp => exp.id === id);
        if (expenseToDelete) {
            const notificationTime = localStorage.getItem('notificationTime') || '09:00';
            CalendarService.removeFromCalendar(expenseToDelete, notificationTime);
        }
        setExpenses(prev => prev.filter(exp => exp.id !== id));
    };

    const deleteAllRecurring = (id) => {
        const expense = expenses.find(exp => exp.id === id);
        if (!expense || !expense.recurrenceId) return;

        const recurrenceId = expense.recurrenceId;
        const recurringExpenses = expenses.filter(exp => exp.recurrenceId === recurrenceId);

        // Remove all from calendar
        const notificationTime = localStorage.getItem('notificationTime') || '09:00';
        recurringExpenses.forEach(exp => {
            CalendarService.removeFromCalendar(exp, notificationTime);
        });

        // Remove all from state
        setExpenses(prev => prev.filter(exp => exp.recurrenceId !== recurrenceId));
    };

    const updateExpense = (id, updatedData) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, ...updatedData } : exp
        ));
    };

    const markAsPaid = (id) => {
        const expenseToPay = expenses.find(exp => exp.id === id);
        if (expenseToPay) {
            const notificationTime = localStorage.getItem('notificationTime') || '09:00';
            CalendarService.removeFromCalendar(expenseToPay, notificationTime);
        }
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, isPaid: true } : exp
        ));
    };

    const markAllAsPaid = (id) => {
        const expense = expenses.find(exp => exp.id === id);
        if (!expense || !expense.recurrenceId) return;

        const recurrenceId = expense.recurrenceId;
        const recurringExpenses = expenses.filter(exp => exp.recurrenceId === recurrenceId);

        // Remove all from calendar
        const notificationTime = localStorage.getItem('notificationTime') || '09:00';
        recurringExpenses.forEach(exp => {
            CalendarService.removeFromCalendar(exp, notificationTime);
        });

        // Mark all as paid
        setExpenses(prev => prev.map(exp =>
            exp.recurrenceId === recurrenceId ? { ...exp, isPaid: true } : exp
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
            deleteAllRecurring,
            markAsPaid,
            markAllAsPaid,
            getExpensesByMonth
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
