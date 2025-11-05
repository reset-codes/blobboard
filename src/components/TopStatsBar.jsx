import React from 'react';

const TopStatsBar = ({ isLoading, totalDataStoredTB, epochInfo }) => {
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
  
  // Calculate hours left in epoch
  const epochDurationHours = epochDurationDays * 24; // 14 days = 336 hours
  const epochProgressHours = (epochProgress / 100) * epochDurationHours;
  const hoursLeftInEpoch = Math.max(0, epochDurationHours - epochProgressHours);
  
  // Determine what to display for time left
  const displayTimeLeft = hoursLeftInEpoch < 24 
    ? `${Math.ceil(hoursLeftInEpoch)} hours` 
    : `${epochDurationDays - currentDayInEpoch} days`;

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: 'rgba(26, 27, 45, 0.95)',
        backdropFilter: 'blur(15px) saturate(180%)',
        padding: 'clamp(8px, 2vw, 16px) clamp(12px, 3vw, 24px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(197, 132, 246, 0.2)',
        zIndex: 99,
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: 'clamp(14px, 3vw, 18px)',
        color: 'white',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'rgba(26, 27, 45, 0.95)',
      backdropFilter: 'blur(15px) saturate(180%)',
      padding: 'clamp(8px, 2vw, 16px) clamp(12px, 3vw, 24px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.1)',
      borderBottom: '1px solid rgba(197, 132, 246, 0.2)',
      zIndex: 99,
      boxSizing: 'border-box',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap',
        gap: 'clamp(8px, 3vw, 24px)',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 4vw, 2.5rem)',
        boxSizing: 'border-box'
      }}>
        {/* Storage Capacity Section */}
        <div className="top-stats-section" style={{
          flex: '1 1 45%',
          minWidth: 'clamp(200px, 35vw, 300px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: 'clamp(11px, 2.5vw, 14px)', 
            fontWeight: '600', 
            color: '#fff',
            marginBottom: 'clamp(3px, 1vw, 8px)',
            textAlign: 'center'
          }}>
            Storage Used: <span style={{ color: '#C584F6' }}>{totalDataStoredTB?.toLocaleString(undefined, { maximumFractionDigits: 2 })} TB</span> / <span style={{ color: '#97F0E5' }}>{(maxStorageCapacityTB / 1024)?.toFixed(2)} PB</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            width: '100%',
            maxWidth: '500px'
          }}>
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
                  background: 'linear-gradient(90deg, #C584F6, #9b59b6)',
                  borderRadius: '5px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
            <div style={{ 
              fontSize: 'clamp(11px, 2.5vw, 14px)', 
              fontWeight: '600', 
              color: '#fff', 
              minWidth: 'clamp(30px, 6vw, 40px)',
              textAlign: 'right' 
            }}>
              {(apiStoragePercentage || storagePercentage).toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Epoch Progress Section */}
        <div className="top-stats-section" style={{
          flex: '1 1 45%',
          minWidth: 'clamp(200px, 35vw, 300px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: 'clamp(11px, 2.5vw, 14px)', 
            fontWeight: '600', 
            color: '#fff',
            marginBottom: 'clamp(3px, 1vw, 8px)',
            textAlign: 'center'
          }}>
            Epoch <span style={{ color: '#C584F6' }}>{currentEpoch}</span>: ~<span style={{ color: '#97F0E5' }}>{displayTimeLeft}</span> left
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            width: '100%',
            maxWidth: '500px'
          }}>
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
                  background: 'linear-gradient(90deg, #97F0E5, #4ECDC4)',
                  borderRadius: '5px',
                  transition: 'width 0.3s ease'
                }} 
              />
            </div>
            <div style={{ 
              fontSize: 'clamp(11px, 2.5vw, 14px)', 
              fontWeight: '600', 
              color: '#fff', 
              minWidth: 'clamp(30px, 6vw, 40px)',
              textAlign: 'right' 
            }}>
              {epochProgress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopStatsBar;