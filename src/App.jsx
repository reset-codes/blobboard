import { useState, useEffect, useRef } from 'react'
import './App.css'
import './AppCustom.css'

const WAL_FALLBACK_PRICE = 0.4;
const SUI_FALLBACK_PRICE = 1.0;

const WAL_ICON = 'https://coinmeta.polymedia.app/img/coins/0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59-wal-WAL.svg'; // Placeholder, replace with actual WAL icon if available
const SUI_ICON = 'https://coinmeta.polymedia.app/img/coins/0x0000000000000000000000000000000000000000000000000000000000000002-sui-SUI.svg';
const BTC_ICON = 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';

function App() {
  const [results, setResults] = useState(null)
  const [walPrice, setWalPrice] = useState(WAL_FALLBACK_PRICE)
  const [suiPrice, setSuiPrice] = useState(SUI_FALLBACK_PRICE)
  const [btcPrice, setBtcPrice] = useState(0)
  const [storagePrice, setStoragePrice] = useState(55000);
  const [editingStorage, setEditingStorage] = useState(false);
  const inputRef = useRef(null);
  
  // Fixed constant for frost per MiB per epoch
  const FROST_PER_MIB_PER_EPOCH = 55000;
  // State for total data stored on Walrus (in TB)
  const [totalDataStoredTB, setTotalDataStoredTB] = useState(1100); // 1100 TB = 1.1 PB
  const [editingTotalData, setEditingTotalData] = useState(false);
  const totalDataRef = useRef(null);

  // Add state for editable frost per MiB
  const [frostPerMiB, setFrostPerMiB] = useState(FROST_PER_MIB_PER_EPOCH);
  const [editingFrost, setEditingFrost] = useState(false);
  const frostInputRef = useRef(null);

  // Add state for user input amount to store (in TB)
  const [userStorageTB, setUserStorageTB] = useState(1);
  // Add state for unit selection
  const [userStorageUnit, setUserStorageUnit] = useState('TB');

  // Conversion factors
  const unitToTB = {
    TB: 1,
    GB: 1 / 1024,
    MB: 1 / (1024 * 1024),
  };

  useEffect(() => {
    // Fetch WAL, SUI, and BTC prices from CoinGecko
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=walrus-2,sui,bitcoin&vs_currencies=usd');
        const data = await res.json();
        if (data['walrus-2'] && data['walrus-2'].usd) setWalPrice(data['walrus-2'].usd);
        if (data.sui && data.sui.usd) setSuiPrice(data.sui.usd);
        if (data.bitcoin && data.bitcoin.usd) setBtcPrice(data.bitcoin.usd);
      } catch (e) {
        setWalPrice(WAL_FALLBACK_PRICE);
        setSuiPrice(SUI_FALLBACK_PRICE);
        setBtcPrice(0);
      }
    };
    fetchPrices();
  }, []);

  // Focus input when editing
  useEffect(() => {
    if (editingStorage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingStorage]);

  // Focus total data input when editing
  useEffect(() => {
    if (editingTotalData && totalDataRef.current) {
      totalDataRef.current.focus();
    }
  }, [editingTotalData]);

  // Update useEffect for focus
  useEffect(() => {
    if (editingFrost && frostInputRef.current) {
      frostInputRef.current.focus();
    }
  }, [editingFrost]);

  const calculateWAL = () => {
    const frostPerMiBValue = parseFloat(frostPerMiB) || 0;
    const frostPerGB = frostPerMiBValue * 1024 // 1 GB = 1024 MiB
    const frostPerTB = frostPerGB * 1024 // 1 TB = 1024 GB
    
    const walPerGB = frostPerGB / 1000000000 // 1 WAL = 1 billion frost
    const walPerTB = frostPerTB / 1000000000

    // Time-based calculations for 1 GB and 1 TB (assuming the input is for 1 epoch = 14 days)
    const frostPerGBPerDay = frostPerGB / 14 // Cost per day for 1 GB
    const frostPerGBPerEpoch = frostPerGB // Cost per epoch for 1 GB
    const frostPerGBPerYear = frostPerGB * (365 / 14) // Cost per year for 1 GB

    const frostPerTBPerDay = frostPerTB / 14 // Cost per day for 1 TB
    const frostPerTBPerEpoch = frostPerTB // Cost per epoch for 1 TB
    const frostPerTBPerYear = frostPerTB * (365 / 14) // Cost per year for 1 TB

    const walPerGBPerDay = frostPerGBPerDay / 1000000000
    const walPerGBPerEpoch = frostPerGBPerEpoch / 1000000000
    const walPerGBPerYear = frostPerGBPerYear / 1000000000

    const walPerTBPerDay = frostPerTBPerDay / 1000000000
    const walPerTBPerEpoch = frostPerTBPerEpoch / 1000000000
    const walPerTBPerYear = frostPerTBPerYear / 1000000000

    // Calculate revenue based on current totalDataStoredTB
    const revenuePerDay = walPerTBPerDay * totalDataStoredTB;
    const revenuePerMonth = revenuePerDay * 30; // Approximate month
    const revenuePerYear = walPerTBPerYear * totalDataStoredTB;
    
    setResults({
      walPerGB: walPerGB.toFixed(6),
      walPerTB: walPerTB.toFixed(6),
      walPerGBPerDay: walPerGBPerDay.toFixed(6),
      walPerGBPerEpoch: walPerGBPerEpoch.toFixed(6),
      walPerGBPerYear: walPerGBPerYear.toFixed(6),
      walPerTBPerDay: walPerTBPerDay.toFixed(6),
      walPerTBPerEpoch: walPerTBPerEpoch.toFixed(6),
      walPerTBPerYear: walPerTBPerYear.toFixed(6),
      revenuePerDay: revenuePerDay.toFixed(6),
      revenuePerMonth: revenuePerMonth.toFixed(6),
      revenuePerYear: revenuePerYear.toFixed(6)
    })
  }

  // Ensure calculateWAL is called whenever totalDataStoredTB changes
  useEffect(() => {
    calculateWAL();
  }, [totalDataStoredTB, frostPerMiB]);

  // Calculate costs for the user input (convert to TB)
  const userStorageTBValue = (parseFloat(userStorageTB) || 0) * unitToTB[userStorageUnit];
  const costPerTBPerDay = results ? parseFloat(results.walPerTBPerDay) : 0;
  const costPerTBPerEpoch = results ? parseFloat(results.walPerTBPerEpoch) : 0;
  const costPerTBPerYear = results ? parseFloat(results.walPerTBPerYear) : 0;
  const costPerTBPerDayUSD = costPerTBPerDay * walPrice;
  const costPerTBPerEpochUSD = costPerTBPerEpoch * walPrice;
  const costPerTBPerYearUSD = costPerTBPerYear * walPrice;

  const userCostDay = userStorageTBValue * costPerTBPerDay;
  const userCostEpoch = userStorageTBValue * costPerTBPerEpoch;
  const userCostYear = userStorageTBValue * costPerTBPerYear;
  const userCostDayUSD = userCostDay * walPrice;
  const userCostEpochUSD = userCostEpoch * walPrice;
  const userCostYearUSD = userCostYear * walPrice;

  // Helper to render WAL + $ value with commas
  const renderWalWithUsd = (walValue, decimals = 2, isSublabel = false) => {
    const walNum = parseFloat(walValue);
    const walFormatted = walNum.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const usdFormatted = (walNum * walPrice).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (isSublabel) {
      return (
        <>
          <span>{walFormatted} WAL</span>
          <br />
          <span style={{ fontSize: '50%', opacity: 0.6, display: 'block', marginTop: 2 }}>
            ${usdFormatted} USD
          </span>
        </>
      );
    }
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

  const handleStorageClick = () => {
    setEditingStorage(true);
  };

  const handleStorageChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setStoragePrice(val ? parseInt(val, 10) : '');
  };

  const handleStorageBlur = () => setEditingStorage(false);
  const handleStorageKeyDown = (e) => {
    if (e.key === 'Enter') setEditingStorage(false);
  };

  const handleTotalDataClick = () => {
    setEditingTotalData(true);
  };

  const handleTotalDataChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setTotalDataStoredTB(val ? parseInt(val, 10) : 1100);
  };

  const handleTotalDataBlur = () => setEditingTotalData(false);
  const handleTotalDataKeyDown = (e) => {
    if (e.key === 'Enter') setEditingTotalData(false);
  };

  return (
    <div className="app-container">
      {/* Main container */}
      <div className="responsive-main">
        {/* Heading */}
        <div className="pixel-heading" style={{ margin: '0 auto 64px auto', padding: '32px 0 0 0', textAlign: 'center', display: 'block', width: '100%' }}>
          <span style={{ color: '#fff' }}>Blob</span> <span style={{ color: '#b7aaff' }}>Board</span>
        </div>
        {/* After the four cards and before the Storage Cost on Walrus card, add: */}
        {results && (
          <>
            {/* Card grid */}
            <div className="responsive-card-grid">
              <div className="card-col">
                <div className="data-box">
                  <div className="card-title">WAL per 1 GB (Epoch)</div>
                  <div className="card-value">{renderWalWithUsd(results.walPerGB, 3)}</div>
                </div>
                <div className="data-box">
                  <div className="card-title">Write Cost per 1 GB</div>
                  <div className="card-value">{renderWalWithUsd((20000 * 1024 / 1000000000).toFixed(6), 3)}</div>
                  <div className="card-sublabel">* This fee is only paid once and is not recurring.</div>
                </div>
              </div>
              <div className="card-col">
                <div className="data-box">
                  <div className="card-title">WAL per 1 TB (Epoch)</div>
                  <div className="card-value">{renderWalWithUsd(results.walPerTB)}</div>
                </div>
                <div className="data-box">
                  <div className="card-title">Write Cost per 1 TB</div>
                  <div className="card-value">{renderWalWithUsd((20000 * 1024 * 1024 / 1000000000).toFixed(6))}</div>
                  <div className="card-sublabel">* This fee is only paid once and is not recurring.</div>
                </div>
              </div>
            </div>
            {/* Editable fields and note */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 48,
              margin: '32px 0 8px 0',
            }}>
              {/* Editable Frost per MiB per Epoch */}
              <div style={{ fontSize: 18, color: '#b7aaff', fontWeight: 600 }}>
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
              {/* Editable Total Data Stored */}
              <div style={{ fontSize: 18, color: '#b7aaff', fontWeight: 600 }}>
                Total Data Stored:&nbsp;
                {editingTotalData ? (
                  <input
                    ref={totalDataRef}
                    type="number"
                    value={totalDataStoredTB}
                    onChange={handleTotalDataChange}
                    onBlur={handleTotalDataBlur}
                    onKeyDown={handleTotalDataKeyDown}
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
                    onClick={handleTotalDataClick}
                    style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 4, cursor: 'pointer', textDecoration: 'underline dotted' }}
                  >
                    {totalDataStoredTB.toLocaleString()} TB
                  </span>
                )}
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginLeft: 2 }}>*</span>
              </div>
            </div>
            <div className="footnote" style={{ marginBottom: 24, marginTop: 0, color: '#fff', opacity: 0.8, fontSize: 15, textAlign: 'center' }}>
              * You can click the values above to edit them.
            </div>
            {/* Storage Cost Table */}
            <div style={{ margin: '40px auto 0 auto', maxWidth: 900, background: '#18192b', borderRadius: 18, border: '2px solid #2e2f4a', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', padding: '32px 24px', color: '#fff' }}>
              <div className="card-title" style={{ fontSize: 20, marginBottom: 18, textAlign: 'center' }}>Storage Cost on Walrus</div>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <span className="card-title" style={{ fontSize: 16, marginRight: 8, textTransform: 'none' }}>Amount to Store:</span>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={userStorageTB}
                  onChange={e => setUserStorageTB(e.target.value.replace(/[^0-9.]/g, ''))}
                  style={{
                    width: 100,
                    fontSize: 16,
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #b7aaff',
                    background: '#23243a',
                    color: '#fff',
                    textAlign: 'right',
                    fontWeight: 600,
                    marginLeft: 8,
                    marginRight: 8,
                  }}
                />
                <select
                  value={userStorageUnit}
                  onChange={e => setUserStorageUnit(e.target.value)}
                  style={{
                    fontSize: 16,
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #b7aaff',
                    background: '#23243a',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  <option value="TB">TB</option>
                  <option value="GB">GB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none', color: '#fff', fontSize: 16 }}>
                <thead>
                  <tr className="table-header">
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Period</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Cost (WAL)</th>
                    <th style={{ padding: '10px 8px', borderBottom: '1px solid #2e2f4a' }}>Cost (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-body">
                    <td style={{ padding: '10px 8px', color: '#b7aaff', fontWeight: 600 }}>1 Day</td>
                    <td style={{ padding: '10px 8px' }}>{userCostDay.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                    <td style={{ padding: '10px 8px' }}>${userCostDayUSD.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                  </tr>
                  <tr className="table-body">
                    <td style={{ padding: '10px 8px', color: '#b7aaff', fontWeight: 600 }}>1 Epoch</td>
                    <td style={{ padding: '10px 8px' }}>{userCostEpoch.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                    <td style={{ padding: '10px 8px' }}>${userCostEpochUSD.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                  </tr>
                  <tr className="table-body">
                    <td style={{ padding: '10px 8px', color: '#b7aaff', fontWeight: 600 }}>1 Year</td>
                    <td style={{ padding: '10px 8px' }}>{userCostYear.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                    <td style={{ padding: '10px 8px' }}>${userCostYearUSD.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Revenue Card */}
            <div className="revenue-section data-box" style={{ margin: '32px auto 0 auto', maxWidth: 900, marginBottom: '8rem' }}>
              <div className="revenue-title">REVENUE</div>
              <div className="revenue-sublabel" style={{ marginBottom: 10 }}>
                Total Data Stored:&nbsp;
                <span className="revenue-sublabel" style={{ fontWeight: 700, fontSize: 15, textDecoration: 'underline dotted', cursor: 'pointer' }}>{totalDataStoredTB.toLocaleString()} TB</span>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 12 }}>
                {/* Table-like layout for centered values and period labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 420 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                    <span className="revenue-value" style={{ fontSize: 20, lineHeight: 1.7 }}>{renderWalWithUsd(results.revenuePerDay, 2)}</span>
                    <span className="revenue-sublabel" style={{ fontSize: 20, color: '#b7aaff', fontWeight: 600, minWidth: 80, textAlign: 'left' }}>per Day</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                    <span className="revenue-value" style={{ fontSize: 20, lineHeight: 1.7 }}>{renderWalWithUsd(results.revenuePerMonth, 2)}</span>
                    <span className="revenue-sublabel" style={{ fontSize: 20, color: '#b7aaff', fontWeight: 600, minWidth: 80, textAlign: 'left' }}>per Month</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                    <span className="revenue-value" style={{ fontSize: 20, lineHeight: 1.7 }}>{renderWalWithUsd(results.revenuePerYear, 2)}</span>
                    <span className="revenue-sublabel" style={{ fontSize: 20, color: '#b7aaff', fontWeight: 600, minWidth: 80, textAlign: 'left' }}>per Year</span>
                  </div>
                </div>
              </div>
              <div className="footnote" style={{ marginTop: 24, color: '#b7aaff', opacity: 0.7, fontSize: 14, textAlign: 'center' }}>
                **The revenue is just based on the current storage price with the amount of data stored. It doesn't include the write cost and also the previous price and data. It is just a prediction on the current earnings; the actual data may be higher but not lower from now.
              </div>
            </div>
          </>
        )}
      </div>
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
        <div style={{ textAlign: 'center', color: '#b7aaff', fontSize: 16, marginBottom: 8, letterSpacing: 1 }}>
          1 WAL = 1,000,000,000 frost &nbsp; | &nbsp; 1 GB = 1,024 MiB &nbsp; | &nbsp; 1 TB = 1,024 GB &nbsp; | &nbsp; 1 epoch = 14 days &nbsp; | &nbsp; 1 year = 365 days
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, margin: '8px 0 8px 0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#191a2b', borderRadius: 16, padding: '8px 22px' }}>
            <img src={WAL_ICON} alt="WAL" style={{ width: 32, height: 32, borderRadius: '50%', background: '#b7faff', border: '2px solid #23243a' }} />
            <span style={{ color: '#b7aaff', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>WAL</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 8 }}>${walPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#191a2b', borderRadius: 16, padding: '8px 22px' }}>
            <img src={SUI_ICON} alt="SUI" style={{ width: 32, height: 32, borderRadius: '50%', background: '#eaf6ff', border: '2px solid #23243a' }} />
            <span style={{ color: '#b7aaff', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>SUI</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 8 }}>${suiPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#191a2b', borderRadius: 16, padding: '8px 22px' }}>
            <img src={BTC_ICON} alt="BTC" style={{ width: 32, height: 32, borderRadius: '50%', background: '#ffb84d', border: '2px solid #23243a' }} />
            <span style={{ color: '#b7aaff', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>BTC</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginLeft: 8 }}>${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </span>
        </div>
        <div className="footer-text" style={{ width: '100%', textAlign: 'center', color: '#b7aaff', fontSize: 16, opacity: 0.7, letterSpacing: 1, marginTop: 8 }}>
          Made with <span style={{ color: '#ff4d9d', fontSize: 18, verticalAlign: 'middle' }}>❤️</span> by <a href="https://x.com/Reset_sui" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: '#b7aaff', textDecoration: 'underline' }}>Reset.sui</a>
        </div>
      </footer>
    </div>
  )
}

export default App

