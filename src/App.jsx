import React, { useState, useRef } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import AddExpenseModal from './components/AddExpenseModal';
import MonthSelector from './components/MonthSelector';
import ViewSwitcher from './components/ViewSwitcher';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, calendar, settings
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Swipe gesture refs
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingExpense(null);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e) => {
    // Only handle swipe on dashboard and calendar views, not settings
    if (currentView === 'settings') return;

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (currentView === 'settings') return;
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Check if horizontal swipe is dominant (not vertical scroll)
    if (Math.abs(diffX) > Math.abs(diffY)) {
      const threshold = 50; // Minimum swipe distance

      if (diffX > threshold) {
        // Swiped Left -> Next Month
        handleMonthChange(1);
      } else if (diffX < -threshold) {
        // Swiped Right -> Previous Month
        handleMonthChange(-1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const renderContent = () => {
    if (currentView === 'settings') {
      return <Settings />;
    }

    if (currentView === 'calendar') {
      return <CalendarView currentDate={currentDate} onEdit={handleEdit} />;
    }

    return <Dashboard currentDate={currentDate} onEdit={handleEdit} />;
  };

  return (
    <ExpenseProvider>
      <div className="app-container">
        {/* Top Header */}
        <header className="app-header">
          <MonthSelector
            currentDate={currentDate}
            onMonthChange={handleMonthChange}
            onOpenSettings={() => setCurrentView('settings')}
          />
          {currentView !== 'settings' && (
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          )}
          {currentView === 'settings' && (
            <div className="settings-header-bar">
              <button onClick={() => setCurrentView('dashboard')}>← Geri</button>
            </div>
          )}
        </header>

        <main
          className="main-content"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {renderContent()}
        </main>

        {/* Bottom Floating Action Button */}
        <div className="bottom-fab-container">
          <button
            className="fab-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            +
          </button>
        </div>

        {isAddModalOpen && (
          <AddExpenseModal
            isOpen={isAddModalOpen}
            onClose={handleCloseModal}
            initialDate={currentDate}
            expenseToEdit={editingExpense}
          />
        )}
      </div>

      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: var(--bg-color);
          color: white;
        }
        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: var(--bg-color);
        }
        .settings-header-bar {
          padding: 10px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .settings-header-bar button {
          background: none;
          color: var(--primary-color);
          font-size: 16px;
        }
        .main-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 100px; /* Space for FAB */
        }
        
        .bottom-fab-container {
          position: fixed;
          bottom: 30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 100;
          pointer-events: none; /* Allow clicking through empty space */
        }
        .fab-btn {
          pointer-events: auto;
          width: 60px;
          height: 60px;
          background-color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: white;
          box-shadow: 0 4px 16px rgba(255, 69, 58, 0.5);
          transition: transform 0.2s;
        }
        .fab-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </ExpenseProvider>
  );
}

export default App;
