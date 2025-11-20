import React from 'react';

const SummaryCard = ({ totalAmount, remainingAmount, currency = 'TRY' }) => {
  const format = (amount) => new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(amount);

  return (
    <div className="summary-card">
      <div className="summary-item">
        <span className="label">Kalan Gider</span>
        <span className="amount highlight">{format(remainingAmount)}</span>
      </div>
      <div className="divider"></div>
      <div className="summary-item">
        <span className="label">Toplam Gider</span>
        <span className="amount">{format(totalAmount)}</span>
      </div>

      <style>{`
                .summary-card {
                    background: linear-gradient(135deg, var(--surface-color), var(--surface-color-light));
                    border-radius: var(--radius-lg);
                    padding: 20px;
                    margin: 20px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .summary-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .divider {
                    width: 1px;
                    height: 40px;
                    background-color: var(--border-color);
                }
                .label {
                    font-size: 12px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .amount {
                    font-size: 20px;
                    font-weight: 700;
                    color: white;
                }
                .amount.highlight {
                    color: var(--primary-color);
                    font-size: 24px;
                }
            `}</style>
    </div>
  );
};

export default SummaryCard;
