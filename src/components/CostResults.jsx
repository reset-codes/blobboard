
import React from 'react';

const CostResults = ({ userCosts }) => {
  if (!userCosts) return null;

  const { 
    individualCostDayWAL, individualCostDayUSD,
    individualCostMonthWAL, individualCostMonthUSD,
    individualCostYearWAL, individualCostYearUSD,
    quiltCostDayWAL, quiltCostDayUSD,
    quiltCostMonthWAL, quiltCostMonthUSD,
    quiltCostYearWAL, quiltCostYearUSD,
    savingsDayUSD, savingsMonthUSD, savingsYearUSD,
  } = userCosts;

  const formatNumber = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Determine color for savings - green if positive, grey if zero or negative
  const getSavingsColor = (savings) => {
    return parseFloat(savings) > 0 ? '#66ff66' : '#888888';
  };

  // Function to render cost with WAL as main value and USD as subtext
  const renderCost = (walValue, usdValue) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '1em', fontWeight: '600' }}>{formatNumber(walValue)} WAL</div>
      <div style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '4px' }}>${formatNumber(usdValue)} USD</div>
    </div>
  );

  return (
    <div className="cost-results-container" style={{
      margin: '0 auto',
      maxWidth: 900,
      background: '#18192b',
      borderRadius: 18,
      border: '2px solid #2e2f4a',
      padding: 'clamp(12px, 3vw, 24px)',
      color: '#fff',
      marginTop: -10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: 'clamp(16px, 3vw, 20px)', marginBottom: 18, textAlign: 'center', color: '#C584F6', fontWeight: 600 }}>
        Cost Comparison
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table className="cost-comparison-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'none', color: '#fff', fontSize: 'clamp(14px, 2vw, 16px)' }}>
          <thead>
            <tr className="table-header">
              <th style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Period</th>
              <th style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Blob</th>
              <th style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Quilt</th>
              <th style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Savings (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-body" style={{ textAlign: 'center' }}>
              <td data-label="Period" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', color: '#C584F6', fontWeight: 600 }}>1 Day</td>
              <td data-label="Blob" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)' }}>
                {renderCost(individualCostDayWAL, individualCostDayUSD)}
              </td>
              <td data-label="Quilt" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)' }}>
                {renderCost(quiltCostDayWAL, quiltCostDayUSD)}
              </td>
              <td data-label="Savings" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', fontWeight: 700, color: getSavingsColor(savingsDayUSD) }}>
                <div style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>${formatNumber(savingsDayUSD)}</div>
                <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
              </td>
            </tr>
            <tr className="table-body" style={{ textAlign: 'center' }}>
              <td data-label="Period" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', color: '#C584F6', fontWeight: 600 }}>1 Month</td>
              <td data-label="Blob" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)' }}>
                {renderCost(individualCostMonthWAL, individualCostMonthUSD)}
              </td>
              <td data-label="Quilt" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)' }}>
                {renderCost(quiltCostMonthWAL, quiltCostMonthUSD)}
              </td>
              <td data-label="Savings" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', fontWeight: 700, color: getSavingsColor(savingsMonthUSD) }}>
                <div style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>${formatNumber(savingsMonthUSD)}</div>
                <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
              </td>
            </tr>
            <tr className="table-body" style={{ textAlign: 'center' }}>
              <td data-label="Period" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', color: '#C584F6', fontWeight: 600 }}>1 Year</td>
              <td data-label="Blob" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)' }}>
                {renderCost(individualCostYearWAL, individualCostYearUSD)}
              </td>
              <td data-label="Quilt" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)' }}>
                {renderCost(quiltCostYearWAL, quiltCostYearUSD)}
              </td>
              <td data-label="Savings" style={{ padding: 'clamp(8px, 2vw, 10px) clamp(4px, 1.5vw, 8px)', fontWeight: 700, color: getSavingsColor(savingsYearUSD) }}>
                <div style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>${formatNumber(savingsYearUSD)}</div>
                <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="disclaimer" style={{ textAlign: 'center', marginTop: '16px' }}>
        *All costs are approximate and based on current network rates. Actual costs may vary.
      </div>
    </div>
  );
};

export default CostResults;
