import React from 'react';
import { WRITE_FEE_FROST } from '../utils/constants';

const RevenueSection = ({ isLoading, baseCosts, revenue, walPrice }) => {

  const renderWalWithUsd = (walValue, walDecimals = 4, isPurple = true) => {
    const walNum = parseFloat(walValue) || 0;
    const walFormatted = walNum.toLocaleString(undefined, { minimumFractionDigits: walDecimals, maximumFractionDigits: walDecimals });
    const usdFormatted = (walNum * walPrice).toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 });
    return (
      <>
        <span style={{ color: isPurple ? '#C584F6' : '#97F0E5' }}>{walFormatted} WAL</span>
        <br />
        <span style={{ fontSize: '50%', opacity: 0.6, display: 'block', marginTop: 2, color: '#9ca3af' }}>
          ${usdFormatted} USD
        </span>
      </>
    );
  };

  if (!baseCosts || !revenue) return null;

  // Calculate write costs using the constant
  const writeCostPerGB = (WRITE_FEE_FROST * 1024 / 1000000000);
  const writeCostPerTB = (WRITE_FEE_FROST * 1024 * 1024 / 1000000000);

  if (isLoading) {
    return (
      <div className="data-box" style={{ margin: '0 auto', maxWidth: 900 }}>
        <div className="skeleton-loader" style={{ height: '600px' }}></div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="data-box" style={{ margin: '0 auto', maxWidth: 850, width: '100%', padding: 'clamp(12px, 3vw, 16px)' }}>
        <div className="card-title" style={{ textAlign: 'center', marginBottom: '12px', fontSize: 'clamp(18px, 3.5vw, 24px)', color: '#fff', fontWeight: 600 }}>Simple Cost</div>
        <div className="revenue-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '1px',
          backgroundColor: '#2e2f4a',
          borderRadius: '12px',
          overflow: 'hidden',
          marginTop: '0',

        }}>
          {/* Top Left - WAL per 1 GB */}
          <div style={{
            backgroundColor: '#18192b',
            padding: 'clamp(12px, 3vw, 16px) clamp(6px, 1.5vw, 6px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '6px', fontSize: 'clamp(13px, 2vw, 15px)', color: '#9ca3af' }}>WAL per 1 GB</div>
            <div className="card-value" style={{ fontSize: 'clamp(16px, 2.5vw, 18px)' }}>
              {renderWalWithUsd(baseCosts.walPerGBPerEpoch, 4, true)}
            </div>
            <div className="card-sublabel" style={{ marginTop: '4px', fontSize: 'clamp(12px, 1.8vw, 13px)', color: '#6b7280' }}>(Epoch)</div>
          </div>

          {/* Top Right - WAL per 1 TB */}
          <div style={{
            backgroundColor: '#18192b',
            padding: 'clamp(12px, 3vw, 16px) clamp(6px, 1.5vw, 6px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderLeft: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '6px', fontSize: 'clamp(13px, 2vw, 15px)', color: '#9ca3af' }}>WAL per 1 TB</div>
            <div className="card-value" style={{ fontSize: 'clamp(16px, 2.5vw, 18px)' }}>
              {renderWalWithUsd(baseCosts.walPerTBPerEpoch, 4, true)}
            </div>
            <div className="card-sublabel" style={{ marginTop: '4px', fontSize: 'clamp(12px, 1.8vw, 13px)', color: '#6b7280' }}>(Epoch)</div>
          </div>

          {/* Bottom Left - Write Cost per 1 GB */}
          <div style={{
            backgroundColor: '#18192b',
            padding: 'clamp(12px, 3vw, 16px) clamp(6px, 1.5vw, 6px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderTop: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '6px', fontSize: 'clamp(13px, 2vw, 15px)', color: '#9ca3af' }}>Write Cost per 1 GB</div>
            <div className="card-value" style={{ fontSize: 'clamp(16px, 2.5vw, 18px)' }}>
              {renderWalWithUsd(writeCostPerGB.toFixed(4), 4, false)}
            </div>
          </div>

          {/* Bottom Right - Write Cost per 1 TB */}
          <div style={{
            backgroundColor: '#18192b',
            padding: 'clamp(12px, 3vw, 16px) clamp(6px, 1.5vw, 6px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderLeft: '1px solid #2e2f4a',
            borderTop: '1px solid #2e2f4a'
          }}>
            <div className="card-sublabel" style={{ marginBottom: '6px', fontSize: 'clamp(13px, 2vw, 15px)', color: '#9ca3af' }}>Write Cost per 1 TB</div>
            <div className="card-value" style={{ fontSize: 'clamp(16px, 2.5vw, 18px)' }}>
              {renderWalWithUsd(writeCostPerTB.toFixed(4), 4, false)}
            </div>
          </div>
        </div>
        <div className="card-sublabel" style={{ marginTop: '8px', textAlign: 'center', color: '#6b7280' }}>
          Write fees are only paid once and are not recurring.
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;