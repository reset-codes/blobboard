# 🔍 Quick Debug Guide

## Issue: Epoch shows "0" and "0%" instead of "12" and "50%"

### Step 1: Open Browser Console
1. Press `Cmd + Option + I` (macOS)
2. Click on the **Console** tab
3. Clear the console (click the 🚫 icon)

### Step 2: Hard Refresh
Press `Cmd + Shift + R` to force reload

### Step 3: Look for These Logs

You should see these console logs in order:

```javascript
✅ Walrus API Full Response: {
  status: "success",
  timestamp: "2025-12-09...",
  data: {
    storage_price: 504,
    storage_capacity: { used_tb: 606.5, total_pb: 4.07, percentage: 14.55 },
    epoch_info: { current_epoch: 12, epoch_percentage_completed: 49.67, source: "database" }
  },
  cached: true
}

📊 Parsed Data: {
  storage_price: 504,
  used_tb: 606.5,
  total_pb: 4.07,
  percentage: 14.55,
  current_epoch: 12,        👈 Should be 12, not undefined
  epoch_progress: 49.67,    👈 Should be ~50, not undefined
  has_epoch_info: true,     👈 Should be true
  cached: true
}

🔄 Setting epochInfo to: {
  current_epoch: 12,
  epoch_percentage_completed: 49.67,
  source: "database",
  storage_capacity: { used_tb: 606.5, total_pb: 4.07, percentage: 14.55 }
}

📊 TopStatsBar received: {
  isLoading: false,
  totalDataStoredTB: 606.5,
  epochInfo: { current_epoch: 12, epoch_percentage_completed: 49.67, ... },
  hasEpochInfo: true,       👈 Should be true
  currentEpoch: 12,         👈 Should be 12, not 0
  epochProgress: 49.67      👈 Should be ~50, not 0
}

🔢 Calculated values: {
  epochProgress: 49.67,
  currentEpoch: 12,
  storagePercentage: 14.55,
  maxStorageCapacityTB: 4167.68
}
```

### Step 4: Expected UI After Fix

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Storage Used: 606.5 TB / 4.07 PB      Epoch 12: ~7 days left           │
│ [████████████████░░░░░░░░░░] 14.6%    [████████████░░░░░░░] 50%         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Step 5: If Still Shows "Epoch 0"

Check the console output and paste it here. Specifically look for:

1. **If you see ⚠️ warning**: The API might not be returning epoch_info
2. **If current_epoch is undefined**: There's a data structure issue
3. **If epochInfo is null in TopStatsBar**: The state isn't being set

### Manual API Test in Browser Console

Paste this in the browser console to test the API directly:

```javascript
fetch('https://walrus-api.walrus-api.workers.dev/api/walrus/latest')
  .then(r => r.json())
  .then(data => {
    console.log('Direct API test:', data);
    console.log('Epoch info:', data.data.epoch_info);
  });
```

This should output:
```javascript
Direct API test: { status: "success", ... }
Epoch info: { current_epoch: 12, epoch_percentage_completed: 49.67, source: "database" }
```

---

## Common Issues & Solutions

### Issue 1: "current_epoch: undefined" in logs
**Problem:** API structure changed or fetch failed  
**Solution:** Check if API is accessible. The fallback should set it to 12.

### Issue 2: TopStatsBar shows "hasEpochInfo: false"
**Problem:** State not updating  
**Solution:** React state issue. Stop dev server and restart:
```bash
# In terminal, press Ctrl+C, then:
npm run dev
```

### Issue 3: Console shows CORS error
**Problem:** Browser blocking API  
**Solution:** Check network tab. API should have CORS headers enabled.

### Issue 4: No console logs at all
**Problem:** Code not running  
**Solution:** 
1. Check if dev server is running
2. Hard refresh browser
3. Check browser console for JavaScript errors

---

## Quick Fix Command

If all else fails, restart everything:

```bash
# Stop dev server (Ctrl+C), then:
rm -rf node_modules/.vite
npm run dev
```

Then hard refresh browser: `Cmd + Shift + R`

---

## What the Console Logs Mean

| Log | What It Means | What to Check |
|-----|---------------|---------------|
| ✅ Walrus API Full Response | API call succeeded | Check if `epoch_info` exists |
| 📊 Parsed Data | Data extracted | Check if `current_epoch` is 12 |
| 🔄 Setting epochInfo | State being set | Check the object structure |
| 📊 TopStatsBar received | Component got props | Check if `hasEpochInfo` is true |
| 🔢 Calculated values | Final display values | Check if values are correct |
| ⚠️ Warning | Fallback being used | API might not have epoch_info |

---

**After following these steps, your UI should show:**
- ✅ **Epoch 12** (not 0)
- ✅ **~7 days left** (not ~13 days)
- ✅ **50% progress bar** (not 0%)
