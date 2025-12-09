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
import { WAL_FALLBACK_PRICE, SUI_FALLBACK_PRICE, FROST_PER_MIB_PER_EPOCH, UNIT_TO_TB, WALRUS_API_BASE } from './utils/constants';

function App() {
  const [baseCosts, setBaseCosts] = useState(null);
  const [userCosts, setUserCosts] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [walPrice, setWalPrice] = useState(WAL_FALLBACK_PRICE);
  const [suiPrice, setSuiPrice] = useState(SUI_FALLBACK_PRICE);
  const [btcPrice, setBtcPrice] = useState(0);

  const [frostPerMiB, setFrostPerMiB] = useState(FROST_PER_MIB_PER_EPOCH);
  const [totalDataStoredTB, setTotalDataStoredTB] = useState(509);
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
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          });
        const walrusDataPromise = fetch(`${WALRUS_API_BASE}/latest`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          });

        const [pricesData, walrusData] = await Promise.all([pricesPromise, walrusDataPromise]);

        if (pricesData['walrus-2']?.usd) setWalPrice(pricesData['walrus-2'].usd);
        if (pricesData.sui?.usd) setSuiPrice(pricesData.sui.usd);
        if (pricesData.bitcoin?.usd) setBtcPrice(pricesData.bitcoin.usd);

        if (walrusData.data) {
          console.log('✅ Walrus API Full Response:', walrusData);
          
          // Extract epoch_info with fallback
          const epochInfoData = walrusData.data.epoch_info || {};
          const storageCapacityData = walrusData.data.storage_capacity || {};
          
          console.log('📊 Parsed Data:', {
            storage_price: walrusData.data.storage_price,
            used_tb: storageCapacityData.used_tb,
            total_pb: storageCapacityData.total_pb,
            percentage: storageCapacityData.percentage,
            current_epoch: epochInfoData.current_epoch,
            epoch_progress: epochInfoData.epoch_percentage_completed,
            has_epoch_info: !!walrusData.data.epoch_info,
            cached: walrusData.cached
          });
          
          setFrostPerMiB(walrusData.data.storage_price);
          setTotalDataStoredTB(storageCapacityData.used_tb);
          
          // The new API includes epoch_info directly in data with storage_capacity
          if (walrusData.data.epoch_info) {
            const newEpochInfo = {
              current_epoch: epochInfoData.current_epoch,
              epoch_percentage_completed: epochInfoData.epoch_percentage_completed,
              source: epochInfoData.source,
              storage_capacity: storageCapacityData
            };
            console.log('🔄 Setting epochInfo to:', newEpochInfo);
            setEpochInfo(newEpochInfo);
          } else {
            console.warn('⚠️ No epoch_info in API response, using fallback');
            // Set fallback epoch info
            setEpochInfo({
              current_epoch: 12,
              epoch_percentage_completed: 50,
              source: 'fallback',
              storage_capacity: storageCapacityData
            });
          }
        } else {
          console.error('❌ No data in Walrus API response:', walrusData);
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
          epochInfo={epochInfo}
        />
        <Header />

        <div className="section-spacing">
          <RevenueSection
            isLoading={false}
            baseCosts={baseCosts}
            revenue={revenue}
            walPrice={walPrice}
          />
        </div>

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
      </div>
      <Footer walPrice={walPrice} suiPrice={suiPrice} btcPrice={btcPrice} />
    </div>
  )
}

export default App;