
import { UNIT_TO_TB, WRITE_FEE_USD, MAX_FILES_PER_QUILT } from './constants';

const DAYS_IN_MONTH = 30; // Approximate
const DAYS_IN_YEAR = 365;

export const calculateBaseWalCosts = (frostPerMiB) => {
  const frostPerMiBValue = parseFloat(frostPerMiB) || 0;
  const frostPerGBPerEpoch = frostPerMiBValue * 1024; // 1 GB = 1024 MiB
  const frostPerTBPerEpoch = frostPerGBPerEpoch * 1024; // 1 TB = 1024 GB

  const walPerGBPerEpoch = frostPerGBPerEpoch / 1000000000; // 1 WAL = 1 billion frost
  const walPerTBPerEpoch = frostPerTBPerEpoch / 1000000000;

  // Time-based calculations (assuming 1 epoch = 14 days)
  const walPerTBPerDay = walPerTBPerEpoch / 14;
  
  return {
    walPerGBPerEpoch: walPerGBPerEpoch.toFixed(4),
    walPerTBPerEpoch: walPerTBPerEpoch.toFixed(4),
    walPerTBPerDay: walPerTBPerDay.toFixed(4),
    walPerTBPerYear: (walPerTBPerDay * 365).toFixed(4),
  };
};

export const calculateUserCosts = (storageDetails, baseCosts, walPrice) => {
  const { userStorage, userStorageUnit, numberOfFiles } = storageDetails;
  
  const numFiles = parseFloat(numberOfFiles) || 0;
  const sizePerFile = parseFloat(userStorage) || 0;
  
  if (numFiles === 0 || sizePerFile === 0) return null;

  const sizePerFileTB = sizePerFile * (UNIT_TO_TB[userStorageUnit] || 0);
  const totalStorageTB = sizePerFileTB * numFiles;

  const costPerTBPerYear = baseCosts ? parseFloat(baseCosts.walPerTBPerYear) : 0;
  const storageCostYearUSD = (totalStorageTB * costPerTBPerYear) * walPrice;

  // Individual Files Calculation
  const individualWriteCostUSD = numFiles * WRITE_FEE_USD;
  
  const individualCostYearUSD = storageCostYearUSD + individualWriteCostUSD;
  const individualCostMonthUSD = individualCostYearUSD / 12;
  const individualCostDayUSD = individualCostYearUSD / DAYS_IN_YEAR;

  // Quilt Calculation
  const numQuiltTransactions = Math.ceil(numFiles / MAX_FILES_PER_QUILT);
  const quiltWriteCostUSD = numQuiltTransactions * WRITE_FEE_USD;

  const quiltCostYearUSD = storageCostYearUSD + quiltWriteCostUSD;
  const quiltCostMonthUSD = quiltCostYearUSD / 12;
  const quiltCostDayUSD = quiltCostYearUSD / DAYS_IN_YEAR;

  // Savings
  const savingsYearUSD = individualCostYearUSD - quiltCostYearUSD;
  const savingsMonthUSD = individualCostMonthUSD - quiltCostMonthUSD;
  const savingsDayUSD = individualCostDayUSD - quiltCostDayUSD;

  return {
    totalStorageTB,
    individualCostYearUSD,
    individualCostMonthUSD,
    individualCostDayUSD,
    individualCostYearWAL: individualCostYearUSD / walPrice,
    individualCostMonthWAL: individualCostMonthUSD / walPrice,
    individualCostDayWAL: individualCostDayUSD / walPrice,
    quiltCostYearUSD,
    quiltCostMonthUSD,
    quiltCostDayUSD,
    quiltCostYearWAL: quiltCostYearUSD / walPrice,
    quiltCostMonthWAL: quiltCostMonthUSD / walPrice,
    quiltCostDayWAL: quiltCostDayUSD / walPrice,
    savingsYearUSD,
    savingsMonthUSD,
    savingsDayUSD,
  };
};

export const calculateRevenue = (totalDataStoredTB, baseCosts) => {
  const costPerTBPerDay = baseCosts ? parseFloat(baseCosts.walPerTBPerDay) : 0;
  const revenuePerDay = costPerTBPerDay * totalDataStoredTB;
  const revenuePerMonth = revenuePerDay * DAYS_IN_MONTH; // Use DAYS_IN_MONTH
  const revenuePerYear = revenuePerDay * DAYS_IN_YEAR; // Use DAYS_IN_YEAR

  return {
    revenuePerDay: revenuePerDay.toFixed(4),
    revenuePerMonth: revenuePerMonth.toFixed(4),
    revenuePerYear: revenuePerYear.toFixed(4),
  };
};
