import React, { useState, useRef } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ExpenseList = ({ expenses, onMarkAsPaid, onEdit, onDelete }) => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, expenseId: null, title: '', type: 'pay' }); // type: 'pay' | 'delete'
  const [swipedExpenseId, setSwipedExpenseId] = useState(null);
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

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
      title: expense.title,
      type: 'pay'
    });
  };

  const handleDeleteClick = (e, expense) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      expenseId: expense.id,
      title: expense.title,
      type: 'delete'
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.expenseId) {
      if (confirmModal.type === 'pay') {
        onMarkAsPaid(confirmModal.expenseId);
      } else if (confirmModal.type === 'delete') {
        if (onDelete) onDelete(confirmModal.expenseId);
      }
    }
    setSwipedExpenseId(null);
  };

  // Touch Handlers for Swipe
  const onTouchStart = (e, id) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchCurrentX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchCurrentX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e, id) => {
    if (!touchStartX.current || !touchCurrentX.current) return;

    const diffX = touchStartX.current - touchCurrentX.current;
    const threshold = 50; // Minimum swipe distance

    if (diffX > threshold) {
      // Swiped Left -> Open
      setSwipedExpenseId(id);
    } else if (diffX < -threshold) {
      // Swiped Right -> Close
      if (swipedExpenseId === id) {
        setSwipedExpenseId(null);
      }
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
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
                <div
                  key={expense.id}
                  className={`expense-item-wrapper ${swipedExpenseId === expense.id ? 'swiped' : ''}`}
                  onTouchStart={(e) => onTouchStart(e, expense.id)}
                  onTouchMove={onTouchMove}
                  onTouchEnd={(e) => onTouchEnd(e, expense.id)}
                >
                  <div className={`expense-item-container ${expense.isPaid ? 'paid' : ''}`}>
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

                  {/* Delete Button (Revealed on Swipe) */}
                  <div className="delete-action">
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(e, expense)}
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === 'pay' ? "Harcamayı Öde" : "Harcamayı Sil"}
        message={
          confirmModal.type === 'pay'
            ? `${confirmModal.title} giderini ödendi olarak işaretlemek istiyor musunuz?`
            : `${confirmModal.title} giderini kalıcı olarak silmek istiyor musunuz?`
        }
        confirmText={confirmModal.type === 'pay' ? "Evet, Öde" : "Evet, Sil"}
        confirmColor={confirmModal.type === 'delete' ? 'var(--danger-color)' : 'var(--primary-color)'}
      />

      <style>{`
        .expense-list {
          padding: 0 20px;
          overflow-x: hidden; /* Prevent horizontal scroll from swipe */
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
        
        /* Swipe Wrapper */
        .expense-item-wrapper {
            position: relative;
            overflow: hidden;
            margin-bottom: 8px;
            border-radius: var(--radius-sm);
            background-color: var(--surface-color); /* Ensure background covers delete btn */
        }

        .expense-item-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px; /* Increased padding for better touch target */
          background-color: var(--surface-color);
          position: relative;
          z-index: 2; /* Above delete button */
          transition: transform 0.3s ease-out;
          width: 100%;
        }

        .expense-item-wrapper.swiped .expense-item-container {
            transform: translateX(-80px); /* Move left to reveal delete */
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

        /* Delete Action (Revealed) */
        .delete-action {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            width: 80px; /* Match translate distance */
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }

        .delete-btn {
            width: 100%;
            height: 100%;
            background-color: var(--danger-color);
            color: white;
            border: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            cursor: pointer;
        }
        .delete-btn:active {
            opacity: 0.8;
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
