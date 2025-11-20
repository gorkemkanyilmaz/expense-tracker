import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ExpenseList = ({ expenses, onMarkAsPaid, onEdit }) => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, expenseId: null, title: '' });

  // Group expenses by day
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = new Date(expense.date);
    const dateKey = date.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: date,
        items: [],
        total: 0
      };
    }
    groups[dateKey].items.push(expense);
    groups[dateKey].total += expense.amount;
    return groups;
  }, {});

  // Sort by date descending (newest first)
  const sortedGroups = Object.values(groupedExpenses).sort((a, b) => b.date - a.date);

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency || 'TRY'
    }).format(amount);
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('tr-TR', { weekday: 'short' });
  };

  const getDayNumber = (date) => {
    return date.getDate();
  };

  const handlePayClick = (e, expense) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      expenseId: expense.id,
      title: expense.title
    });
  };

  const handleConfirmPay = () => {
    if (confirmModal.expenseId) {
      onMarkAsPaid(confirmModal.expenseId);
    }
  };

  return (
    <div className="expense-list">
      {sortedGroups.length === 0 ? (
        <div className="empty-state">Bu ay için gider bulunamadı.</div>
      ) : (
        sortedGroups.map((group) => (
          <div key={group.date.toISOString()} className="day-group">
            <div className="day-header">
              <div className="date-badge">
                <span className="day-number">{getDayNumber(group.date)}</span>
                <span className="day-name">{getDayName(group.date)}</span>
              </div>
              <div className="day-total">
                {formatCurrency(group.total, 'TRY')}
              </div>
            </div>

            <div className="day-items">
              {group.items.map((expense) => (
                <div key={expense.id} className={`expense-item-container ${expense.isPaid ? 'paid' : ''}`}>
                  <div
                    className="expense-item"
                    onClick={() => onEdit(expense)}
                  >
                    <div className="expense-icon">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="expense-details">
                      <div className="expense-title">{expense.title}</div>
                      <div className="expense-category">{expense.category}</div>
                    </div>
                    <div className="expense-amount">
                      {formatCurrency(expense.amount, expense.currency)}
                    </div>
                  </div>

                  {!expense.isPaid && (
                    <div className="item-actions">
                      <button
                        className="action-btn paid-btn"
                        onClick={(e) => handlePayClick(e, expense)}
                      >
                        Öde
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmPay}
        title="Harcamayı Öde"
        message={`${confirmModal.title} giderini ödendi olarak işaretlemek istiyor musunuz?`}
      />

      <style>{`
        .expense-list {
          padding: 0 20px;
        }
        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          padding: 40px;
        }
        .day-group {
          margin-bottom: 20px;
        }
        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--border-color);
        }
        .date-badge {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }
        .day-number {
          font-size: 20px;
          font-weight: 700;
        }
        .day-name {
          font-size: 14px;
          color: var(--text-secondary);
        }
        .day-total {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .expense-item-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          transition: opacity 0.3s;
        }
        .expense-item-container.paid {
          opacity: 0.5;
        }
        .expense-item-container.paid .expense-title,
        .expense-item-container.paid .expense-amount {
          text-decoration: line-through;
        }
        
        .expense-item {
          flex: 1;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .expense-icon {
          width: 40px;
          height: 40px;
          background-color: var(--surface-color-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 20px;
        }
        .expense-details {
          flex: 1;
        }
        .expense-title {
          font-weight: 500;
          margin-bottom: 2px;
        }
        .expense-category {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .expense-amount {
          font-weight: 600;
          color: var(--danger-color);
        }
        
        .item-actions {
            display: flex;
            gap: 8px;
        }

        .action-btn {
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .paid-btn {
          background-color: var(--surface-color-light);
          color: var(--success-color);
          border-color: var(--success-color);
        }
        .paid-btn:active {
          background-color: var(--success-color);
          color: white;
        }
      `}</style>
    </div>
  );
};

// Helper for icons
const getCategoryIcon = (category) => {
  const icons = {
    'Kira': '🏠',
    'Aidat': '🏢',
    'Borç': '🤝',
    'Tatil': '🏖️',
    'Kredi Kartı': '💳',
    'Kredi': '🏦',
    'Sağlık': '🏥',
    'Market': '🛒',
    'Fatura': '📄',
    'Eğlence': '🎉',
    'Ulaşım': '🚌',
    'Diğer': '💸'
  };
  return icons[category] || '💸';
};

export default ExpenseList;
