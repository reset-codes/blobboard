import React, { useState, useRef, useEffect } from 'react';

const RevenueSection = ({ isLoading, baseCosts, revenue, walPrice }) => {



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

  if (isLoading) {
    return (
      <div className="data-box" style={{ margin: '0 auto', maxWidth: 900 }}>
        <div className="skeleton-loader" style={{ height: '600px' }}></div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="data-box" style={{ margin: '0 auto', maxWidth: 900, width: '100%' }}>
        <div className="card-title" style={{ textAlign: 'center' }}>Simple Cost</div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gridTemplateRows: '1fr 1fr', 
          gap: '1px', 
          backgroundColor: '#2e2f4a', 
          borderRadius: '12px', 
          overflow: 'hidden',
          marginTop: '20px',
          
        }}>
          {/* Top Left - WAL per 1 GB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '16px' }}>WAL per 1 GB</div>
            <div className="card-value" style={{ fontSize: '19px' }}>
              {renderWalWithUsd(baseCosts.walPerGBPerEpoch, 8)}
            </div>
            <div className="card-sublabel" style={{ marginTop: '6px', fontSize: '14px' }}>(Epoch)</div>
          </div>
          
          {/* Top Right - WAL per 1 TB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            borderLeft: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '16px' }}>WAL per 1 TB</div>
            <div className="card-value" style={{ fontSize: '19px' }}>
              {renderWalWithUsd(baseCosts.walPerTBPerEpoch, 6)}
            </div>
            <div className="card-sublabel" style={{ marginTop: '6px', fontSize: '14px' }}>(Epoch)</div>
          </div>
          
          {/* Bottom Left - Write Cost per 1 GB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            borderTop: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '16px' }}>Write Cost per 1 GB</div>
            <div className="card-value" style={{ fontSize: '19px' }}>
              {renderWalWithUsd(writeCostPerGB.toFixed(6), 6)}
            </div>
          </div>
          
          {/* Bottom Right - Write Cost per 1 TB */}
          <div style={{ 
            backgroundColor: '#18192b', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
            borderLeft: '1px solid #2e2f4a',
            borderTop: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '8px', fontSize: '16px' }}>Write Cost per 1 TB</div>
            <div className="card-value" style={{ fontSize: '19px' }}>
              {renderWalWithUsd(writeCostPerTB.toFixed(6), 6)}
            </div>
          </div>
        </div>
        <div className="card-sublabel" style={{ marginTop: '12px', textAlign: 'center' }}>
          Write fees are only paid once and are not recurring.
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;