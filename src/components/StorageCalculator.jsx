
import React from 'react';

const StorageCalculator = ({
  userStorage, setUserStorage, userStorageUnit, setUserStorageUnit, numberOfFiles, setNumberOfFiles, totalStorage, frostPerMiB, setFrostPerMiB
}) => {

  const handleFilesChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNumberOfFiles(value);
  };

  const handleStorageChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUserStorage(value);
  };

  const handleFrostChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFrostPerMiB(value);
  };

  const isLargeFile = parseFloat(userStorage) > 10 && userStorageUnit === 'MB';

  return (
    <div style={{ 
      margin: '40px auto 0 auto', 
      maxWidth: 900, 
      background: '#18192b', 
      borderRadius: 18, 
      border: '2px solid #2e2f4a', 
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', 
      padding: '24px', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div className="card-title" style={{ fontSize: 24, marginBottom: 18, textAlign: 'center' }}>
        Storage Cost Calculator
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: 18,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}>
          <span className="card-title" style={{ fontSize: 18, textTransform: 'none' }}>Size per File:</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={userStorage}
            onChange={handleStorageChange}
            style={{
              width: 100,
              fontSize: 18,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #C584F6',
              background: '#23243a',
              color: '#fff',
              textAlign: 'right',
              fontWeight: 600,
            }}
          />
          <select
            value={userStorageUnit}
            onChange={e => setUserStorageUnit(e.target.value)}
            style={{
              fontSize: 18,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #C584F6',
              background: '#23243a',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            <option value="TB">TB</option>
            <option value="GB">GB</option>
            <option value="MB">MB</option>
            <option value="KB">KB</option>
          </select>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}>
          <span className="card-title" style={{ fontSize: 18, textTransform: 'none' }}>Number of Files:</span>
          <input
            type="number"
            min={1}
            step={1}
            value={numberOfFiles}
            onChange={handleFilesChange}
            style={{
              width: 100,
              fontSize: 18,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #C584F6',
              background: '#23243a',
              color: '#fff',
              textAlign: 'right',
              fontWeight: 600,
            }}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}>
          <span className="card-title" style={{ fontSize: 18, textTransform: 'none' }}>Frost per MiB:</span>
          <input
            type="number"
            min={1}
            step={1}
            value={frostPerMiB}
            onChange={handleFrostChange}
            style={{
              width: 100,
              fontSize: 18,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #C584F6',
              background: '#23243a',
              color: '#fff',
              textAlign: 'right',
              fontWeight: 600,
            }}
          />
          <span className="card-title" style={{ fontSize: 16, textTransform: 'none', opacity: 0.7 }}>per Epoch</span>
        </div>
      </div>

      {totalStorage > 0 && (
        <div className="disclaimer" style={{ textAlign: 'center' }}>
          Calculating for <strong>{numberOfFiles} files</strong> at <strong>{userStorage} {userStorageUnit}</strong> each = <strong>{(totalStorage * 1024).toFixed(4)} GB</strong> total storage.
        </div>
      )}

      {numberOfFiles > 660 && (
        <div className="note" style={{ textAlign: 'center' }}>
          Note: More than 660 files will require multiple Quilt transactions. The calculation below accounts for this.
        </div>
      )}

      {isLargeFile && (
         <div className="note" style={{ textAlign: 'center' }}>
          Note: Quilts are most effective for files under 10 MB. The cost savings may be less significant for larger files.
        </div>
      )}

    </div>
  );
};

export default StorageCalculator;
