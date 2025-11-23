import React from 'react';

const RecurringActionModal = ({ isOpen, onClose, onSingle, onAll, actionType, expenseTitle }) => {
    if (!isOpen) return null;

    const isMark = actionType === 'mark';
    const isDelete = actionType === 'delete';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isMark ? 'Ödeme Seçeneği' : 'Silme Seçeneği'}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <p className="expense-title">{expenseTitle}</p>
                    <p className="question">
                        Bu tekrarlı bir gider. Ne yapmak istersiniz?
                    </p>
                </div>

                <div className="modal-actions-vertical">
                    <button className="btn-single" onClick={onSingle}>
                        {isMark ? '🔵 Sadece Bu Gideri Öde' : '🔵 Sadece Bu Gideri Sil'}
                    </button>
                    <button className="btn-all" onClick={onAll}>
                        {isMark ? '🔴 Bu Giderin Tüm Tekrarlarını Öde' : '🔴 Bu Giderin Tüm Tekrarlarını Sil'}
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        İptal
                    </button>
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
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
          }
          .modal-content {
            background-color: var(--bg-color);
            width: 90%;
            max-width: 400px;
            border-radius: var(--radius-lg);
            padding: 20px;
            animation: scaleIn 0.3s ease;
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
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
          .modal-header h2 {
            font-size: 18px;
            margin: 0;
          }
          .close-btn {
            background: none;
            color: var(--text-secondary);
            font-size: 24px;
            padding: 0;
            width: 30px;
            height: 30px;
          }
          .modal-body {
            margin-bottom: 20px;
          }
          .expense-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 12px;
          }
          .question {
            font-size: 14px;
            color: var(--text-secondary);
            margin: 0;
          }
          .modal-actions-vertical {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .btn-single, .btn-all, .btn-cancel {
            padding: 14px;
            border-radius: var(--radius-md);
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            transition: var(--transition-fast);
          }
          .btn-single {
            background-color: rgba(0, 122, 255, 0.15);
            color: #007AFF;
            border: 1px solid rgba(0, 122, 255, 0.3);
          }
          .btn-single:hover {
            background-color: rgba(0, 122, 255, 0.25);
          }
          .btn-all {
            background-color: rgba(255, 69, 58, 0.15);
            color: var(--primary-color);
            border: 1px solid rgba(255, 69, 58, 0.3);
          }
          .btn-all:hover {
            background-color: rgba(255, 69, 58, 0.25);
          }
          .btn-cancel {
            background-color: var(--surface-color);
            color: var(--text-primary);
          }
          .btn-cancel:hover {
            background-color: var(--surface-color-light);
          }
        `}</style>
            </div>
        </div>
    );
};

export default RecurringActionModal;
