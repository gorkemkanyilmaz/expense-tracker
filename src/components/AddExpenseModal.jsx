import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';

const CATEGORIES = [
  { id: 'Kira', icon: '🏠', label: 'Kira' },
  { id: 'Aidat', icon: '🏢', label: 'Aidat' },
  { id: 'Borç', icon: '🤝', label: 'Borç' },
  { id: 'Kredi Kartı', icon: '💳', label: 'Kredi Kartı' },
  { id: 'Kredi', icon: '🏦', label: 'Kredi' },
  { id: 'Fatura', icon: '📄', label: 'Fatura' },
  { id: 'Market', icon: '🛒', label: 'Market' },
  { id: 'Ulaşım', icon: '🚌', label: 'Ulaşım' },
  { id: 'Sağlık', icon: '🏥', label: 'Sağlık' },
  { id: 'Eğlence', icon: '🎉', label: 'Eğlence' },
  { id: 'Tatil', icon: '🏖️', label: 'Tatil' },
  { id: 'Diğer', icon: '💸', label: 'Diğer' },
];

const AddExpenseModal = ({ isOpen, onClose, initialDate, expenseToEdit }) => {
  const { addExpense, updateExpense } = useExpenses();

  const [date, setDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceDuration, setRecurrenceDuration] = useState(1);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        // Edit Mode
        const d = new Date(expenseToEdit.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDate(`${year}-${month}-${day}`);

        setAmount(expenseToEdit.amount);
        setCurrency(expenseToEdit.currency);
        setCategory(expenseToEdit.category);
        setTitle(expenseToEdit.title);
        setIsRecurring(expenseToEdit.isRecurring);
        // We don't typically edit recurrence duration for a single item, but let's keep it simple
        setRecurrenceDuration(1);
      } else if (initialDate) {
        // Add Mode
        const year = initialDate.getFullYear();
        const month = String(initialDate.getMonth() + 1).padStart(2, '0');
        const day = String(initialDate.getDate()).padStart(2, '0');
        setDate(`${year}-${month}-${day}`);

        // Reset fields
        setAmount('');
        setCurrency('TRY');
        setCategory('');
        setTitle('');
        setIsRecurring(false);
        setRecurrenceDuration(1);
      }
    }
  }, [isOpen, initialDate, expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !title || !date) return;

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, {
        date,
        amount: parseFloat(amount),
        currency,
        category,
        title,
        isRecurring // Usually we don't change recurrence status on single edit, but passing it through
      });
    } else {
      addExpense({
        date,
        amount,
        currency,
        category,
        title,
        isRecurring,
        recurrenceDuration: isRecurring ? parseInt(recurrenceDuration) : 1
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{expenseToEdit ? 'Gideri Düzenle' : 'Gider Ekle'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date Section */}
          <div className="form-group">
            <label>Tarih</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Recurrence Section - Only show in Add Mode for simplicity */}
          {!expenseToEdit && (
            <>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  Tekrarlı Gider
                </label>
              </div>

              {isRecurring && (
                <div className="form-group">
                  <label>Kaç Ay Tekrar Edecek?</label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={recurrenceDuration}
                    onChange={(e) => setRecurrenceDuration(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {/* Category Section */}
          <div className="form-group">
            <label>Kategori</label>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-item ${category === cat.id ? 'selected' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Currency Section */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Tutar</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group w-100">
              <label>Para Birimi</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="TRY">TL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Title Section */}
          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              placeholder="Örn: Ev Kirası"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>İptal</button>
            <button type="submit" className="btn-save">{expenseToEdit ? 'Güncelle' : 'Kaydet'}</button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: flex-end; /* Bottom sheet on mobile */
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background-color: var(--bg-color);
          width: 100%;
          max-width: 600px;
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
          padding: 20px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .close-btn {
          background: none;
          color: var(--text-secondary);
          font-size: 24px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-row {
          display: flex;
          gap: 12px;
        }
        .flex-1 { flex: 1; }
        .w-100 { width: 100px; }
        
        label {
          display: block;
          color: var(--text-secondary);
          margin-bottom: 8px;
          font-size: 14px;
        }
        input, select {
          width: 100%;
          padding: 12px;
          background-color: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: white;
          font-size: 16px;
        }
        input:focus, select:focus {
          border-color: var(--primary-color);
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 16px;
          margin: 0;
          cursor: pointer;
        }
        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: var(--primary-color);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .category-item {
          background-color: var(--surface-color);
          border: 1px solid transparent;
          border-radius: var(--radius-sm);
          padding: 10px 5px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: var(--transition-fast);
        }
        .category-item.selected {
          background-color: rgba(255, 69, 58, 0.1);
          border-color: var(--primary-color);
        }
        .cat-icon {
          font-size: 24px;
        }
        .cat-label {
          font-size: 10px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-align: center;
        }
        .category-item.selected .cat-label {
          color: var(--primary-color);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-cancel, .btn-save {
          flex: 1;
          padding: 14px;
          border-radius: var(--radius-md);
          font-size: 16px;
          font-weight: 600;
        }
        .btn-cancel {
          background-color: var(--surface-color);
          color: var(--text-primary);
        }
        .btn-save {
          background-color: var(--primary-color);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AddExpenseModal;
