import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import SummaryCard from './SummaryCard';
import ExpenseList from './ExpenseList';

const Dashboard = ({ currentDate, onEdit }) => {
    const { getExpensesByMonth, markAsPaid, deleteExpense } = useExpenses();

    const expenses = getExpensesByMonth(currentDate.getFullYear(), currentDate.getMonth());

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingAmount = expenses.reduce((sum, expense) => expense.isPaid ? sum : sum + expense.amount, 0);

    return (
        <div className="dashboard">
            <SummaryCard totalAmount={totalAmount} remainingAmount={remainingAmount} />
            <ExpenseList
                expenses={expenses}
                onMarkAsPaid={markAsPaid}
                onEdit={onEdit}
                onDelete={deleteExpense}
            />
        </div>
    );
};

export default Dashboard;
