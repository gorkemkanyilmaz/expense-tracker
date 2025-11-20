import React from 'react';

const MonthSelector = ({ currentDate, onMonthChange, onOpenSettings }) => {
  const formattedDate = currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  return (
    <div className="month-selector">
      <div className="selector-controls">
        <button onClick={() => onMonthChange(-1)} className="nav-btn">
          &lt;
        </button>
        <h2>{formattedDate}</h2>
        <button onClick={() => onMonthChange(1)} className="nav-btn">
          &gt;
        </button>
      </div>

      <button className="settings-btn" onClick={onOpenSettings}>
        ⚙️
      </button>

      <style>{`
        .month-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: var(--bg-color);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .selector-controls {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: center;
          gap: 20px;
        }
        .month-selector h2 {
          font-size: 18px;
          font-weight: 600;
          text-transform: capitalize;
          min-width: 120px;
          text-align: center;
        }
        .nav-btn {
          background: none;
          color: var(--primary-color);
          font-size: 24px;
          padding: 5px;
        }
        .settings-btn {
          background: none;
          font-size: 20px;
          padding: 5px;
          color: var(--text-secondary);
          position: absolute;
          right: 20px;
        }
      `}</style>
    </div>
  );
};

export default MonthSelector;
