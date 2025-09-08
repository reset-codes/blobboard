
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

  return (
    <div style={{ margin: '0 auto', maxWidth: 900, background: '#18192b', borderRadius: 18, border: '2px solid #2e2f4a', padding: '24px', color: '#fff', marginTop: -10 }}>
      <div style={{ fontSize: 20, marginBottom: 18, textAlign: 'center', color: '#C584F6', fontWeight: 600 }}>
        Cost Comparison
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none', color: '#fff', fontSize: 16 }}>
        <thead>
          <tr className="table-header">
            <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Period</th>
            <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Blob (WAL)</th>
            <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Blob (USD)</th>
            <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Quilt (WAL)</th>
            <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Quilt (USD)</th>
            <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Savings (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-body" style={{ textAlign: 'center' }}>
            <td style={{ padding: '10px 8px', color: '#C584F6', fontWeight: 600 }}>1 Day</td>
            <td style={{ padding: '10px 8px' }}>
              <div>{formatNumber(individualCostDayWAL)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>WAL</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>${formatNumber(individualCostDayUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>{formatNumber(quiltCostDayWAL)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>WAL</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>${formatNumber(quiltCostDayUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
            <td style={{ padding: '10px 8px', fontWeight: 700, color: getSavingsColor(savingsDayUSD) }}>
              <div>${formatNumber(savingsDayUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
          </tr>
          <tr className="table-body" style={{ textAlign: 'center' }}>
            <td style={{ padding: '10px 8px', color: '#C584F6', fontWeight: 600 }}>1 Month</td>
            <td style={{ padding: '10px 8px' }}>
              <div>{formatNumber(individualCostMonthWAL)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>WAL</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>${formatNumber(individualCostMonthUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>{formatNumber(quiltCostMonthWAL)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>WAL</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>${formatNumber(quiltCostMonthUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
            <td style={{ padding: '10px 8px', fontWeight: 700, color: getSavingsColor(savingsMonthUSD) }}>
              <div>${formatNumber(savingsMonthUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
          </tr>
          <tr className="table-body" style={{ textAlign: 'center' }}>
            <td style={{ padding: '10px 8px', color: '#C584F6', fontWeight: 600 }}>1 Year</td>
            <td style={{ padding: '10px 8px' }}>
              <div>{formatNumber(individualCostYearWAL)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>WAL</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>${formatNumber(individualCostYearUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>{formatNumber(quiltCostYearWAL)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>WAL</div>
            </td>
            <td style={{ padding: '10px 8px' }}>
              <div>${formatNumber(quiltCostYearUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
            <td style={{ padding: '10px 8px', fontWeight: 700, color: getSavingsColor(savingsYearUSD) }}>
              <div>${formatNumber(savingsYearUSD)}</div>
              <div style={{ fontSize: '70%', opacity: 0.8, marginTop: 2 }}>USD</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="disclaimer">
        *All costs are approximate and based on current network rates. Actual costs may vary.
      </div>
    </div>
  );
};

export default CostResults;
