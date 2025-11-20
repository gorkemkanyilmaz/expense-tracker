import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Hayır</button>
          <button className="btn-confirm" onClick={() => { onConfirm(); onClose(); }}>Evet</button>
        </div>
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
          align-items: center; /* Center vertically */
          justify-content: center; /* Center horizontally */
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        .confirm-modal {
          background-color: var(--surface-color);
          padding: 24px;
          border-radius: var(--radius-md);
          width: 85%;
          max-width: 320px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: popIn 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .confirm-modal h3 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
          text-align: left;
        }
        .confirm-modal p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          text-align: left;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-cancel, .btn-confirm {
          flex: 1;
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-cancel {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .btn-confirm {
          background-color: var(--primary-color);
          color: white;
        }
        .btn-cancel:active, .btn-confirm:active {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
