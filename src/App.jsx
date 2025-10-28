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
  const [epochInfo, setEpochInfo] = useState(null);

  const [userStorage, setUserStorage] = useState('100');
  const [userStorageUnit, setUserStorageUnit] = useState('KB');
  const [numberOfFiles, setNumberOfFiles] = useState('1');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const pricesPromise = fetch('https://api.coingecko.com/api/v3/simple/price?ids=walrus-2,sui,bitcoin&vs_currencies=usd')
          .then(res => res.json());
        const walrusDataPromise = fetch('https://data-walrus.onrender.com/api/walrus/latest')
          .then(res => res.json());

        const [pricesData, walrusData] = await Promise.all([pricesPromise, walrusDataPromise]);

        if (pricesData['walrus-2']?.usd) setWalPrice(pricesData['walrus-2'].usd);
        if (pricesData.sui?.usd) setSuiPrice(pricesData.sui.usd);
        if (pricesData.bitcoin?.usd) setBtcPrice(pricesData.bitcoin.usd);

        if (walrusData.data) {
          setFrostPerMiB(walrusData.data.storage_price);
          setTotalDataStoredTB(walrusData.data.storage_capacity.used_tb);
          setLastUpdated(walrusData.data.last_updated);
          setEpochInfo(walrusData.data.epoch_info);
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
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
      <div className="responsive-main main-content">
        <TopStatsBar 
          isLoading={isLoading} 
          totalDataStoredTB={totalDataStoredTB} 
          frostPerMiB={frostPerMiB} 
          epochInfo={epochInfo} 
        />
        <Header />
        
        {!isLoading ? (
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
                frostPerMiB={frostPerMiB}
                setFrostPerMiB={setFrostPerMiB}
              />
            </div>
            <div className="section-spacing">
              <CostResults userCosts={userCosts} />
            </div>
          </>
        ) : null}
        
        <div className="section-spacing">
          <RevenueSection 
            isLoading={isLoading}
            baseCosts={baseCosts} 
            revenue={revenue}
            walPrice={walPrice}
          />
        </div>
      </div>
      <Footer walPrice={walPrice} suiPrice={suiPrice} btcPrice={btcPrice} />
    </div>
  )
}

export default App;