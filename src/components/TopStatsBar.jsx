import React from 'react';

const TopStatsBar = ({ totalDataStoredTB, frostPerMiB }) => {
  // Calculate storage capacity percentage (assuming 2 PB = 2048 TB as max capacity)
  // This is an example value - you might want to adjust based on actual network limits
  const maxStorageCapacityTB = 2048; // 2 PB
  const storagePercentage = Math.min(100, (totalDataStoredTB / maxStorageCapacityTB) * 100);
  
  // Calculate epoch progress (assuming 14 days per epoch)
  // We'll simulate progress based on current time within an epoch
  const epochDurationDays = 14;
  const getCurrentEpochProgress = () => {
    // This is a simplified simulation - in a real app, you'd get this from an API
    // For now, we'll use the current day within a 14-day cycle
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Calculate which day we are in the current epoch (0-13)
    const dayInEpoch = dayOfYear % epochDurationDays;
    
    // Return progress percentage
    return (dayInEpoch / epochDurationDays) * 100;
  };
  
  const epochProgress = getCurrentEpochProgress();
  const currentEpoch = Math.floor(new Date().getTime() / (epochDurationDays * 24 * 60 * 60 * 1000));

  return (
    <div style={{
      width: '100%',
      background: '#1a1b2d',
      borderRadius: '12px',
      border: '1px solid #2e2f4a',
      padding: '16px 24px',
      marginBottom: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Storage Capacity Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          minWidth: '180px', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#b7aaff' 
        }}>
          Storage Used: {totalDataStoredTB?.toLocaleString()} TB
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            height: '10px', 
            background: '#2e2f4a', 
            borderRadius: '5px', 
            overflow: 'hidden' 
          }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${storagePercentage}%`, 
                background: 'linear-gradient(90deg, #6a5af9, #b7aaff)',
                borderRadius: '5px',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
        </div>
        <div style={{ 
          minWidth: '50px', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#fff', 
          textAlign: 'right' 
        }}>
          {storagePercentage.toFixed(1)}%
        </div>
      </div>
      
      {/* Epoch Progress Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          minWidth: '180px', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#b7aaff' 
        }}>
          Epoch #{currentEpoch}: Day {Math.floor((epochProgress / 100) * 14) + 1}/14
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
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
        </div>
        <div style={{ 
          minWidth: '50px', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#fff', 
          textAlign: 'right' 
        }}>
          {epochProgress.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default TopStatsBar;