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

  const formatUSD = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 });
  const formatWAL = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  // Determine color for savings - green if positive, grey if zero or negative
  const getSavingsColor = (savings) => {
    return parseFloat(savings) > 0 ? '#66ff66' : '#888888';
  };

  // Function to render cost with WAL as main value and USD as subtext
  const renderCost = (walValue, usdValue) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 'clamp(12px, 2vw, 16px)', fontWeight: '600' }}>{formatWAL(walValue)} WAL</div>
      <div style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', opacity: 0.7, marginTop: '4px' }}>${formatUSD(usdValue)} USD</div>
    </div>
  );

  return (
    <div className="cost-results-container" style={{
      margin: '0 auto',
      maxWidth: 850,
      background: '#18192b',
      borderRadius: 18,
      border: '2px solid #2e2f4a',
      padding: 'clamp(12px, 3vw, 24px)',
      color: '#fff',
      marginTop: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: 'clamp(20px, 4vw, 26px)', marginBottom: 18, textAlign: 'center', color: '#fff', fontWeight: 600 }}>
        Cost Comparison
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table className="cost-comparison-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'none', color: '#fff', fontSize: 'clamp(12px, 2vw, 16px)' }}>
          <thead>
            <tr className="table-header">
              <th style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(13px, 2.2vw, 17px)', color: '#9ca3af' }}>Period</th>
              <th style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(13px, 2.2vw, 17px)', color: '#9ca3af' }}>Blob</th>
              <th style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(13px, 2.2vw, 17px)', color: '#9ca3af' }}>Quilt</th>
              <th style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', borderBottom: '1px solid #2e2f4a', fontSize: 'clamp(13px, 2.2vw, 17px)', color: '#9ca3af' }}>Savings (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-body" style={{ textAlign: 'center' }}>
              <td data-label="Period" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', color: '#97F0E5', fontWeight: 600, fontSize: 'clamp(12px, 2vw, 16px)' }}>1 Day</td>
              <td data-label="Blob" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)' }}>
                {renderCost(individualCostDayWAL, individualCostDayUSD)}
              </td>
              <td data-label="Quilt" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)' }}>
                {renderCost(quiltCostDayWAL, quiltCostDayUSD)}
              </td>
              <td data-label="Savings" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', fontWeight: 700, color: getSavingsColor(savingsDayUSD) }}>
                <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>${formatUSD(savingsDayUSD)}</div>
                <div style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', opacity: 0.8, marginTop: 2 }}>USD</div>
              </td>
            </tr>
            <tr className="table-body" style={{ textAlign: 'center' }}>
              <td data-label="Period" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', color: '#97F0E5', fontWeight: 600, fontSize: 'clamp(12px, 2vw, 16px)' }}>1 Month</td>
              <td data-label="Blob" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)' }}>
                {renderCost(individualCostMonthWAL, individualCostMonthUSD)}
              </td>
              <td data-label="Quilt" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)' }}>
                {renderCost(quiltCostMonthWAL, quiltCostMonthUSD)}
              </td>
              <td data-label="Savings" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', fontWeight: 700, color: getSavingsColor(savingsMonthUSD) }}>
                <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>${formatUSD(savingsMonthUSD)}</div>
                <div style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', opacity: 0.8, marginTop: 2 }}>USD</div>
              </td>
            </tr>
            <tr className="table-body" style={{ textAlign: 'center' }}>
              <td data-label="Period" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', color: '#97F0E5', fontWeight: 600, fontSize: 'clamp(12px, 2vw, 16px)' }}>1 Year</td>
              <td data-label="Blob" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)' }}>
                {renderCost(individualCostYearWAL, individualCostYearUSD)}
              </td>
              <td data-label="Quilt" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)' }}>
                {renderCost(quiltCostYearWAL, quiltCostYearUSD)}
              </td>
              <td data-label="Savings" style={{ padding: 'clamp(10px, 2vw, 12px) clamp(6px, 1.5vw, 10px)', fontWeight: 700, color: getSavingsColor(savingsYearUSD) }}>
                <div style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>${formatUSD(savingsYearUSD)}</div>
                <div style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', opacity: 0.8, marginTop: 2 }}>USD</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="disclaimer" style={{ textAlign: 'center', marginTop: '16px' }}>
        *All costs are approximate and based on current network rates. Actual costs may vary.
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <a 
          href="https://docs.wal.app/usage/quilt.html#quilt-walrus-native-batch-store-tool" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#C584F6', 
            textDecoration: 'none', 
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: '500',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#E6B3FF'}
          onMouseLeave={(e) => e.target.style.color = '#C584F6'}
        >
          For more info look at the Quilt docs →
        </a>
      </div>
    </div>
  );
};

export default CostResults;
