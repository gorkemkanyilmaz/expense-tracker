import React from 'react';

const ViewSwitcher = ({ currentView, onViewChange }) => {
    return (
        <div className="view-switcher">
            <button
                className={`switch-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => onViewChange('dashboard')}
            >
                Gün
            </button>
            <button
                className={`switch-btn ${currentView === 'calendar' ? 'active' : ''}`}
                onClick={() => onViewChange('calendar')}
            >
                Takvim
            </button>

            <style>{`
        .view-switcher {
          display: flex;
          padding: 0 20px 10px;
          gap: 20px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-color);
        }
        .switch-btn {
          flex: 1;
          background: none;
          color: var(--text-secondary);
          padding: 10px;
          font-size: 16px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: var(--transition-fast);
        }
        .switch-btn.active {
          color: white;
          border-bottom-color: var(--primary-color);
        }
      `}</style>
        </div>
    );
};

export default ViewSwitcher;
