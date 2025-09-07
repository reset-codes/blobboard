import React from 'react';

const TopStatsBar = ({ totalDataStoredTB, frostPerMiB, epochInfo }) => {
  // Calculate storage capacity percentage from API data
  // We'll use the percentage directly from the API, but also calculate it for verification
  const maxStorageCapacityTB = 3.7 * 1024; // 3.7 PB converted to TB
  const storagePercentage = Math.min(100, (totalDataStoredTB / maxStorageCapacityTB) * 100);
  // Or we can use the API provided percentage if available:
  const apiStoragePercentage = epochInfo?.storage_capacity?.percentage || 0;
  
  // Use API data for epoch progress
  const epochProgress = epochInfo?.epoch_percentage_completed || 0;
  const currentEpoch = epochInfo?.current_epoch || 0;
  
  // Calculate current day in epoch (14-day cycle)
  const epochDurationDays = 14;
  const currentDayInEpoch = Math.floor((epochProgress / 100) * epochDurationDays) + 1;

  return (
    <div style={{
      width: '100%',
      background: '#1a1b2d',
      borderRadius: '12px',
      border: '1px solid #2e2f4a',
      padding: '16px 24px',
      marginBottom: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        {/* Storage Capacity Section */}
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#b7aaff',
            marginBottom: '8px'
          }}>
            Storage Used: {totalDataStoredTB?.toLocaleString(undefined, { maximumFractionDigits: 2 })} TB
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              flex: 1,
              height: '10px', 
              background: '#2e2f4a', 
              borderRadius: '5px', 
              overflow: 'hidden' 
            }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${apiStoragePercentage || storagePercentage}%`, 
                  background: 'linear-gradient(90deg, #6a5af9, #b7aaff)',
                  borderRadius: '5px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#fff', 
              minWidth: '40px',
              textAlign: 'right' 
            }}>
              {(apiStoragePercentage || storagePercentage).toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Epoch Progress Section */}
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#b7aaff',
            marginBottom: '8px'
          }}>
            Epoch #{currentEpoch}: Day {currentDayInEpoch}/{epochDurationDays}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              flex: 1,
              height: '10px', 
              background: '#2e2f4a', 
              borderRadius: '5px', 
              overflow: 'hidden' 
            }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${epochProgress}%`, 
                  background: 'linear-gradient(90deg, #ff6b6b, #ffa502)',
                  borderRadius: '5px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#fff', 
              minWidth: '40px',
              textAlign: 'right' 
            }}>
              {epochProgress.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopStatsBar;