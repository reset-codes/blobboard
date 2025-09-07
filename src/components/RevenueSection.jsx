import React, { useState, useRef, useEffect } from 'react';

const RevenueSection = ({ baseCosts, revenue, totalDataStoredTB, setTotalDataStoredTB, frostPerMiB, setFrostPerMiB, walPrice, lastUpdated }) => {
  const [editingFrost, setEditingFrost] = useState(false);
  const [editingTotalData, setEditingTotalData] = useState(false);
  const frostInputRef = useRef(null);
  const totalDataRef = useRef(null);

  const formatLastUpdated = (timestamp) => {
    // Parse the timestamp string (e.g., "2025-09-01 15:18:55")
    const [datePart, timePart] = timestamp.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    // Create date in UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    
    // Format as "Sep 1, 2025 at 3:18 PM UTC"
    const formattedDate = utcDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    });
    const formattedTime = utcDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: true 
    });
    
    // Calculate hours ago
    const now = new Date();
    const diffMs = now - utcDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    return `${formattedDate} at ${formattedTime} UTC (${diffHours} hours ago)`;
  };

  useEffect(() => {
    if (editingFrost && frostInputRef.current) {
      frostInputRef.current.focus();
    }
  }, [editingFrost]);

  useEffect(() => {
    if (editingTotalData && totalDataRef.current) {
      totalDataRef.current.focus();
    }
  }, [editingTotalData]);

  const renderWalWithUsd = (walValue, decimals = 2) => {
    const walNum = parseFloat(walValue) || 0;
    const walFormatted = walNum.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const usdFormatted = (walNum * walPrice).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return (
      <>
        <span>{walFormatted} WAL</span>
        <br />
        <span style={{ fontSize: '50%', opacity: 0.6, display: 'block', marginTop: 2 }}>
          ${usdFormatted} USD
        </span>
      </>
    );
  };

  if (!baseCosts || !revenue) return null;

  // Calculate write costs
  const writeCostPerGB = (20000 * 1024 / 1000000000);
  const writeCostPerTB = (20000 * 1024 * 1024 / 1000000000);

  return (
    <>
      <div className="data-box" style={{ margin: '0 auto', maxWidth: 900 }}>
        <div className="card-title">Simple Cost</div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gridTemplateRows: '1fr 1fr', 
          gap: '1px', 
          backgroundColor: '#2e2f4a', 
          borderRadius: '12px', 
          overflow: 'hidden',
          marginTop: '20px',
          height: '260px'
        }}>
          {/* Top Left - WAL per 1 GB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px 8px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '17px' }}>WAL per 1 GB</div>
            <div className="card-value" style={{ fontSize: '20px' }}>
              {renderWalWithUsd(baseCosts.walPerGBPerEpoch, 8)}
            </div>
            <div className="card-sublabel" style={{ marginTop: '6px', fontSize: '15px' }}>(Epoch)</div>
          </div>
          
          {/* Top Right - WAL per 1 TB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px 8px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            borderLeft: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '17px' }}>WAL per 1 TB</div>
            <div className="card-value" style={{ fontSize: '20px' }}>
              {renderWalWithUsd(baseCosts.walPerTBPerEpoch, 6)}
            </div>
            <div className="card-sublabel" style={{ marginTop: '6px', fontSize: '15px' }}>(Epoch)</div>
          </div>
          
          {/* Bottom Left - Write Cost per 1 GB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px 8px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            borderTop: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '17px' }}>Write Cost per 1 GB</div>
            <div className="card-value" style={{ fontSize: '20px' }}>
              {renderWalWithUsd(writeCostPerGB.toFixed(6), 6)}
            </div>
          </div>
          
          {/* Bottom Right - Write Cost per 1 TB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px 8px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            borderLeft: '1px solid #2e2f4a',
            borderTop: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '17px' }}>Write Cost per 1 TB</div>
            <div className="card-value" style={{ fontSize: '20px' }}>
              {renderWalWithUsd(writeCostPerTB.toFixed(6), 6)}
            </div>
          </div>
        </div>
        <div className="card-sublabel" style={{ marginTop: '16px', textAlign: 'center' }}>
          * Write fees are only paid once and are not recurring.
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 48,
        margin: '32px 0 8px 0',
      }}>
        <div style={{ fontSize: 18, color: '#C584F6', fontWeight: 600 }}>
          Frost per MiB per Epoch:&nbsp;
          {editingFrost ? (
            <input
              ref={frostInputRef}
              type="number"
              value={frostPerMiB}
              onChange={e => setFrostPerMiB(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => setEditingFrost(false)}
              onKeyDown={e => { if (e.key === 'Enter') setEditingFrost(false); }}
              style={{
                width: 100,
                fontSize: 18,
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #fff',
                background: '#18192b',
                color: '#fff',
                textAlign: 'right',
                fontWeight: 600,
                marginRight: 4,
              }}
            />
          ) : (
            <span
              onClick={() => setEditingFrost(true)}
              style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 4, cursor: 'pointer', textDecoration: 'underline dotted' }}
            >
              {Number(frostPerMiB).toLocaleString()}
            </span>
          )}
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 2 }}>*</span>
        </div>
        <div style={{ fontSize: 18, color: '#C584F6', fontWeight: 600 }}>
          Total Data Stored:&nbsp;
          {editingTotalData ? (
            <input
              ref={totalDataRef}
              type="number"
              value={totalDataStoredTB}
              onChange={e => setTotalDataStoredTB(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => setEditingTotalData(false)}
              onKeyDown={e => { if (e.key === 'Enter') setEditingTotalData(false); }}
              style={{
                width: 100,
                fontSize: 18,
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #fff',
                background: '#18192b',
                color: '#fff',
                textAlign: 'right',
                fontWeight: 600,
                marginRight: 4,
              }}
            />
          ) : (
            <span
              onClick={() => setEditingTotalData(true)}
              style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 4, cursor: 'pointer', textDecoration: 'underline dotted' }}
            >
              {totalDataStoredTB.toLocaleString()} TB
            </span>
          )}
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 2 }}>*</span>
        </div>
      </div>
      <div className="footnote" style={{ marginBottom: 24, marginTop: 0 }}>
        * You can click the values above to edit them.
      </div>
      
      {lastUpdated && (
        <div className="disclaimer">
          Last updated: {formatLastUpdated(lastUpdated)}
        </div>
      )}

      <div className="revenue-section data-box" style={{ margin: '32px auto 0 auto', maxWidth: 900, marginBottom: '8rem' }}>
        <div className="revenue-title">REVENUE</div>
        <div className="revenue-sublabel" style={{ marginBottom: 10 }}>
          Total Data Stored:&nbsp;
          <span className="revenue-sublabel" style={{ fontWeight: 700, fontSize: 15, textDecoration: 'underline dotted', cursor: 'pointer' }}>{totalDataStoredTB.toLocaleString()} TB</span>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <span className="revenue-value" style={{ fontSize: 20, lineHeight: 1.7 }}>{renderWalWithUsd(revenue.revenuePerDay, 2)}</span>
              <span className="revenue-sublabel" style={{ fontSize: 20, color: '#C584F6', fontWeight: 600, minWidth: 80, textAlign: 'left' }}>per Day</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <span className="revenue-value" style={{ fontSize: 20, lineHeight: 1.7 }}>{renderWalWithUsd(revenue.revenuePerMonth, 2)}</span>
              <span className="revenue-sublabel" style={{ fontSize: 20, color: '#C584F6', fontWeight: 600, minWidth: 80, textAlign: 'left' }}>per Month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <span className="revenue-value" style={{ fontSize: 20, lineHeight: 1.7 }}>{renderWalWithUsd(revenue.revenuePerYear, 2)}</span>
              <span className="revenue-sublabel" style={{ fontSize: 20, color: '#C584F6', fontWeight: 600, minWidth: 80, textAlign: 'left' }}>per Year</span>
            </div>
          </div>
        </div>
        <div className="disclaimer" style={{ marginTop: 24 }}>
          **The revenue is just based on the current storage price with the amount of data stored. It doesn't include the write cost and also the previous price and data. It is just a prediction on the current earnings; the actual data may be higher but not lower from now.
        </div>
      </div>
    </>
  );
};

export default RevenueSection;