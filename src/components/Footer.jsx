import React from 'react';
import { WAL_ICON, SUI_ICON, BTC_ICON } from '../utils/constants';

const Footer = ({ walPrice, suiPrice, btcPrice }) => {
  return (
    <footer style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      background: 'rgba(35,36,58,0.85)',
      boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.12)',
      zIndex: 100,
      padding: '18px 0 10px 0',
      borderTop: '1px solid #393a5a',
    }}>
      <div style={{ textAlign: 'center', color: '#C584F6', fontSize: 16, marginBottom: 8, letterSpacing: 1 }}>
        1 WAL = 1,000,000,000 frost &nbsp; | &nbsp; 1 GB = 1,024 MiB &nbsp; | &nbsp; 1 TB = 1,024 GB &nbsp; | &nbsp; 1 epoch = 14 days &nbsp; | &nbsp; 1 year = 365 days
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, margin: '8px 0 8px 0' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#191a2b', borderRadius: 16, padding: '8px 22px' }}>
          <img src={WAL_ICON} alt="WAL" style={{ width: 32, height: 32, borderRadius: '50%', background: '#b7faff', border: '2px solid #23243a' }} />
          <span style={{ color: '#C584F6', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>WAL</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 8 }}>${walPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#191a2b', borderRadius: 16, padding: '8px 22px' }}>
          <img src={SUI_ICON} alt="SUI" style={{ width: 32, height: 32, borderRadius: '50%', background: '#eaf6ff', border: '2px solid #23243a' }} />
          <span style={{ color: '#C584F6', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>SUI</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 8 }}>${suiPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#191a2b', borderRadius: 16, padding: '8px 22px' }}>
          <img src={BTC_ICON} alt="BTC" style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffb84d', border: '2px solid #23243a' }} />
          <span style={{ color: '#C584F6', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>BTC</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 8 }}>${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </span>
      </div>
      <div className="footer-text" style={{ width: '100%', textAlign: 'center', color: '#C584F6', fontSize: 16, opacity: 0.7, letterSpacing: 1, marginTop: 8 }}>
        Made with <span style={{ color: '#ff4d9d', fontSize: 18, verticalAlign: 'middle' }}>❤️</span> by <a href="https://x.com/Reset_sui" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: '#C584F6', textDecoration: 'underline' }}>Reset.sui</a>
      </div>
    </footer>
  );
};

export default Footer;