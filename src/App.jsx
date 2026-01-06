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

        // Handle both wrapped (data.*) and flat API response formats
        const apiData = walrusData.data || walrusData;

        // Detect API format: new flat format has 'epoch' and 'capacity_used_tb'
        // Old format has 'epoch_info' and 'storage_capacity' nested objects
        const isNewFormat = apiData.epoch !== undefined || apiData.capacity_used_tb !== undefined;
        const isOldFormat = apiData.epoch_info !== undefined || apiData.storage_capacity !== undefined;

        console.log('✅ Walrus API Full Response:', walrusData);
        console.log('📋 API Format Detection:', { isNewFormat, isOldFormat });

        if (isNewFormat) {
          // NEW FLAT API FORMAT
          console.log('📊 Using NEW flat API format');
          console.log('📊 Parsed Data:', {
            storage_price: apiData.storage_price,
            write_price: apiData.write_price,
            capacity_used_tb: apiData.capacity_used_tb,
            capacity_total_pb: apiData.capacity_total_pb,
            capacity_percentage: apiData.capacity_percentage,
            epoch: apiData.epoch,
            percentage_completed: apiData.percentage_completed,
            hours_remaining: apiData.hours_remaining,
            days_remaining: apiData.days_remaining,
            is_final_day: apiData.is_final_day
          });

          setFrostPerMiB(apiData.storage_price || FROST_PER_MIB_PER_EPOCH);
          setTotalDataStoredTB(apiData.capacity_used_tb || 509);

          // Map flat API structure to epochInfo state
          const newEpochInfo = {
            current_epoch: apiData.epoch,
            epoch_percentage_completed: apiData.percentage_completed,
            epoch_start_time: apiData.epoch_start_time,
            epoch_end_time: apiData.epoch_end_time,
            epoch_duration_days: apiData.epoch_duration_days || 14,
            hours_remaining: apiData.hours_remaining,
            days_remaining: apiData.days_remaining,
            is_final_day: apiData.is_final_day,
            write_price: apiData.write_price,
            storage_capacity: {
              used_tb: apiData.capacity_used_tb,
              total_pb: apiData.capacity_total_pb,
              percentage: apiData.capacity_percentage
            }
          };
          console.log('🔄 Setting epochInfo to:', newEpochInfo);
          setEpochInfo(newEpochInfo);

        } else if (isOldFormat) {
          // OLD NESTED API FORMAT (backward compatibility)
          console.log('📊 Using OLD nested API format');
          const epochInfoData = apiData.epoch_info || {};
          const storageCapacityData = apiData.storage_capacity || {};

          console.log('📊 Parsed Data (old format):', {
            storage_price: apiData.storage_price,
            used_tb: storageCapacityData.used_tb,
            total_pb: storageCapacityData.total_pb,
            percentage: storageCapacityData.percentage,
            current_epoch: epochInfoData.current_epoch,
            epoch_progress: epochInfoData.epoch_percentage_completed
          });

          setFrostPerMiB(apiData.storage_price || FROST_PER_MIB_PER_EPOCH);
          setTotalDataStoredTB(storageCapacityData.used_tb || 509);

          // Calculate hours_remaining from percentage if not provided (old format)
          const epochDurationDays = 14;
          const epochProgress = epochInfoData.epoch_percentage_completed || 0;
          const calculatedHoursRemaining = ((100 - epochProgress) / 100) * epochDurationDays * 24;
          const calculatedDaysRemaining = calculatedHoursRemaining / 24;

          const newEpochInfo = {
            current_epoch: epochInfoData.current_epoch,
            epoch_percentage_completed: epochInfoData.epoch_percentage_completed,
            epoch_duration_days: epochDurationDays,
            hours_remaining: calculatedHoursRemaining,
            days_remaining: calculatedDaysRemaining,
            is_final_day: calculatedHoursRemaining < 24,
            source: epochInfoData.source,
            storage_capacity: storageCapacityData
          };
          console.log('🔄 Setting epochInfo to:', newEpochInfo);
          setEpochInfo(newEpochInfo);

        } else {
          console.error('❌ No valid data in Walrus API response:', walrusData);
          // Set fallback epoch info
          setEpochInfo({
            current_epoch: 21,
            epoch_percentage_completed: 50,
            epoch_duration_days: 14,
            hours_remaining: 168,
            days_remaining: 7,
            is_final_day: false,
            storage_capacity: { used_tb: 509, total_pb: 3.7, percentage: 13.78 }
          });
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
        // Set fallback on error
        setEpochInfo({
          current_epoch: 21,
          epoch_percentage_completed: 50,
          epoch_duration_days: 14,
          hours_remaining: 168,
          days_remaining: 7,
          is_final_day: false,
          storage_capacity: { used_tb: 509, total_pb: 3.7, percentage: 13.78 }
        });
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