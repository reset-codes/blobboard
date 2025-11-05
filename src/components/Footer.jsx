import React from 'react';
import { WAL_ICON, SUI_ICON, BTC_ICON } from '../utils/constants';

const Footer = ({ walPrice, suiPrice, btcPrice }) => {
  // Only show prices when all have been loaded from API (btcPrice > 0 indicates API has responded)
  const showPrices = btcPrice > 0;

  return (
    <footer className="app-footer">
      <div className="footer-conversion-info">
        1 WAL = 1,000,000,000 frost | 1 GB = 1,024 MiB | 1 TB = 1,024 GB | 1 epoch = 14 days
      </div>

      {showPrices && (
        <div className="footer-prices">
          <span className="price-item">
            <img src={WAL_ICON} alt="WAL" className="price-icon" />
            <span className="price-symbol">WAL</span>
            <span className="price-value">${walPrice.toFixed(2)}</span>
          </span>

          <span className="price-item">
            <img src={SUI_ICON} alt="SUI" className="price-icon" />
            <span className="price-symbol">SUI</span>
            <span className="price-value">${suiPrice.toFixed(2)}</span>
          </span>

          <span className="price-item">
            <img src={BTC_ICON} alt="BTC" className="price-icon" style={{ background: '#C584F6' }} />
            <span className="price-symbol">BTC</span>
            <span className="price-value">${btcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </span>
        </div>
      )}
      
      <div className="footer-credit">
        Made with <span className="heart">❤️</span> by <a href="https://x.com/Reset_sui" target="_blank" rel="noopener noreferrer">Reset.sui</a>
      </div>
    </footer>
  );
};

export default Footer;