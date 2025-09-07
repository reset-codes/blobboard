import { useState, useEffect } from 'react';
import './App.css';
import './AppCustom.css';
import Header from './components/Header';
import TopStatsBar from './components/TopStatsBar';
import Footer from './components/Footer';
import RevenueSection from './components/RevenueSection';
import StorageCalculator from './components/StorageCalculator';
import CostResults from './components/CostResults';
import { calculateBaseWalCosts, calculateUserCosts, calculateRevenue } from './utils/costCalculations';
import { WAL_FALLBACK_PRICE, SUI_FALLBACK_PRICE, FROST_PER_MIB_PER_EPOCH, UNIT_TO_TB } from './utils/constants';

function App() {
  const [baseCosts, setBaseCosts] = useState(null);
  const [userCosts, setUserCosts] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [walPrice, setWalPrice] = useState(WAL_FALLBACK_PRICE);
  const [suiPrice, setSuiPrice] = useState(SUI_FALLBACK_PRICE);
  const [btcPrice, setBtcPrice] = useState(0);

  const [frostPerMiB, setFrostPerMiB] = useState(FROST_PER_MIB_PER_EPOCH);
  const [totalDataStoredTB, setTotalDataStoredTB] = useState(509);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [userStorage, setUserStorage] = useState('100');
  const [userStorageUnit, setUserStorageUnit] = useState('KB');
  const [numberOfFiles, setNumberOfFiles] = useState('1');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=walrus-2,sui,bitcoin&vs_currencies=usd');
        const data = await res.json();
        if (data['walrus-2']?.usd) setWalPrice(data['walrus-2'].usd);
        if (data.sui?.usd) setSuiPrice(data.sui.usd);
        if (data.bitcoin?.usd) setBtcPrice(data.bitcoin.usd);
      } catch (e) {
        console.error("Failed to fetch prices:", e);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchWalrusData = async () => {
      try {
        const res = await fetch('https://data-walrus.onrender.com/api/walrus/latest');
        const data = await res.json();
        if (data.data) {
          // Update frostPerMiB with storage_price from API
          setFrostPerMiB(data.data.storage_price);
          // Update totalDataStoredTB with used_tb from API
          setTotalDataStoredTB(data.data.storage_capacity.used_tb);
          // Update lastUpdated with the timestamp from API
          setLastUpdated(data.data.last_updated);
        }
      } catch (e) {
        console.error("Failed to fetch Walrus data:", e);
      }
    };
    fetchWalrusData();
  }, []);

  useEffect(() => {
    const newBaseCosts = calculateBaseWalCosts(frostPerMiB);
    setBaseCosts(newBaseCosts);

    const newRevenue = calculateRevenue(totalDataStoredTB, newBaseCosts);
    setRevenue(newRevenue);

    const storageDetails = { userStorage, userStorageUnit, numberOfFiles };
    const newUserCosts = calculateUserCosts(storageDetails, newBaseCosts, walPrice);
    setUserCosts(newUserCosts);

  }, [userStorage, userStorageUnit, numberOfFiles, frostPerMiB, totalDataStoredTB, walPrice]);

  const totalStorage = (parseFloat(userStorage) || 0) * (UNIT_TO_TB[userStorageUnit] || 0) * (parseFloat(numberOfFiles) || 0);

  return (
    <div className="app-container">
      <div className="responsive-main" style={{ paddingBottom: '200px' }}>
        <Header />
        {baseCosts && <TopStatsBar totalDataStoredTB={totalDataStoredTB} frostPerMiB={frostPerMiB} />}
        
        {baseCosts && (
          <>
            <div className="section-spacing">
              <StorageCalculator 
                userStorage={userStorage}
                setUserStorage={setUserStorage}
                userStorageUnit={userStorageUnit}
                setUserStorageUnit={setUserStorageUnit}
                numberOfFiles={numberOfFiles}
                setNumberOfFiles={setNumberOfFiles}
                totalStorage={totalStorage}
              />
            </div>
            <div className="section-spacing">
              <CostResults userCosts={userCosts} />
            </div>
            <div className="section-spacing">
              <RevenueSection 
                baseCosts={baseCosts} 
                revenue={revenue}
                totalDataStoredTB={totalDataStoredTB}
                setTotalDataStoredTB={setTotalDataStoredTB}
                frostPerMiB={frostPerMiB}
                setFrostPerMiB={setFrostPerMiB}
                walPrice={walPrice}
                lastUpdated={lastUpdated}
              />
            </div>
          </>
        )}
      </div>
      <Footer walPrice={walPrice} suiPrice={suiPrice} btcPrice={btcPrice} />
    </div>
  )
}

export default App;

