import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseList from './ExpenseList';

const CalendarView = ({ currentDate, onEdit }) => {
  const { getExpensesByMonth, markAsPaid, deleteExpense } = useExpenses();
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const expenses = getExpensesByMonth(year, month);

  // Calendar Logic
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun)
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Helper to check if a day has expenses
  const getExpensesForDay = (date) => {
    if (!date) return [];
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === date.getDate();
    });
  };

  const handleDayClick = (date) => {
    if (date) setSelectedDate(date);
  };

  const selectedDayExpenses = selectedDate ? getExpensesForDay(selectedDate) : [];

  return (
    <div className="calendar-view">
      <div className="calendar-grid">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}

        {days.map((date, index) => {
          const dayExpenses = getExpensesForDay(date);
          const hasExpense = dayExpenses.length > 0;
          const isSelected = selectedDate && date && selectedDate.getDate() === date.getDate();
          const isToday = date && new Date().toDateString() === date.toDateString();

          return (
            <div
              key={index}
              className={`day-cell ${!date ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              {date && (
                <>
                  <span className="day-number">{date.getDate()}</span>
                  {hasExpense && (
                    <div className="cell-content">
                      {dayExpenses.slice(0, 2).map((exp, i) => (
                        <div key={i} className={`mini-expense ${exp.isPaid ? 'paid' : ''}`}>
                          <div className="mini-amount">{Math.round(exp.amount)}</div>
                          <div className="mini-title">{exp.title}</div>
                        </div>
                      ))}
                      {dayExpenses.length > 2 && (
                        <div className="more-indicator">+{dayExpenses.length - 2}</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="selected-day-details">
          <div className="details-header">
            <h3>{selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</h3>
            <button onClick={() => setSelectedDate(null)}>Kapat</button>
          </div>
          <ExpenseList
            expenses={selectedDayExpenses}
            onMarkAsPaid={markAsPaid}
            onEdit={onEdit}
            onDelete={deleteExpense}
          />
        </div>
      )}

      <style>{`
        .calendar-view {
          padding: 20px 10px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background-color: var(--border-color);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .weekday-header {
          background-color: var(--surface-color);
          color: var(--text-secondary);
          font-size: 12px;
          text-align: center;
          padding: 8px 0;
        }
        .day-cell {
          background-color: var(--bg-color);
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 5px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .day-cell.empty {
          background-color: var(--surface-color-light);
          cursor: default;
        }
        .day-cell.selected {
          background-color: rgba(255, 69, 58, 0.1);
          border: 1px solid var(--primary-color);
        }
        .day-cell.today .day-number {
          background-color: var(--primary-color);
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .day-number {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 2px;
        }
        
        .cell-content {
          width: 100%;
          padding: 0 2px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mini-expense {
          background-color: var(--surface-color);
          border-radius: 2px;
          padding: 1px 2px;
          overflow: hidden;
        }
        .mini-expense.paid {
          opacity: 0.5;
        }
        .mini-expense.paid .mini-amount,
        .mini-expense.paid .mini-title {
          text-decoration: line-through;
        }

        .mini-amount {
          font-size: 9px;
          color: var(--danger-color);
          font-weight: 600;
          line-height: 1;
        }
        .mini-title {
          font-size: 8px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1;
        }
        .more-indicator {
          font-size: 8px;
          color: var(--text-secondary);
          text-align: center;
        }
        
        .selected-day-details {
          margin-top: 20px;
          background-color: var(--surface-color);
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
          padding-top: 10px;
          min-height: 200px;
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .details-header h3 {
          font-size: 16px;
        }
        .details-header button {
          color: var(--primary-color);
          background: none;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
