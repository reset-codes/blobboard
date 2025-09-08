/**
 * Calculate epoch information based on provided parameters
 * 
 * Epoch details:
 * - Each epoch lasts 40 days
 * - Next epoch starts on September 9th, 2024 at 1pm UTC
 * - Currently in epoch 12 with 84% completed
 */

// Constants based on provided information
const EPOCH_DURATION_DAYS = 40;
const NEXT_EPOCH_START_DATE = new Date('2024-09-09T13:00:00Z');
const CURRENT_EPOCH_NUMBER = 12;
const CURRENT_EPOCH_PERCENTAGE = 84;

/**
 * Get fixed epoch data based on provided information
 * @returns {Object} Epoch information including current epoch, percentage completed, etc.
 */
export const calculateEpochInfo = () => {
  // Use fixed values as provided
  const currentDayInEpoch = Math.floor((CURRENT_EPOCH_PERCENTAGE / 100) * EPOCH_DURATION_DAYS) + 1;
  
  return {
    current_epoch: CURRENT_EPOCH_NUMBER,
    epoch_percentage_completed: CURRENT_EPOCH_PERCENTAGE,
    storage_capacity: {
      percentage: 0, // This will be set in getCurrentEpochData
    },
    epoch_info: {
      current_epoch: CURRENT_EPOCH_NUMBER,
      epoch_percentage_completed: CURRENT_EPOCH_PERCENTAGE,
      current_day_in_epoch: currentDayInEpoch,
      epoch_duration_days: EPOCH_DURATION_DAYS,
      next_epoch_start_date: NEXT_EPOCH_START_DATE.toISOString(),
    }
  };
};

/**
 * Get current epoch data with storage information
 * @param {number} totalDataStoredTB - The total data stored in TB
 * @returns {Object} Complete epoch information
 */
export const getCurrentEpochData = (totalDataStoredTB) => {
  const epochInfo = calculateEpochInfo();
  
  // Calculate storage capacity percentage (assuming 3.7 PB max capacity)
  const maxStorageCapacityTB = 3.7 * 1024; // 3.7 PB converted to TB
  const storagePercentage = Math.min(100, (totalDataStoredTB / maxStorageCapacityTB) * 100);
  
  return {
    ...epochInfo,
    storage_capacity: {
      ...epochInfo.storage_capacity,
      percentage: storagePercentage,
      used_tb: totalDataStoredTB,
    },
    last_updated: new Date().toISOString(),
  };
};