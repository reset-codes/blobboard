# 🧪 API Testing Guide

## Current Issue
The screenshot shows "Epoch 0: ~13 days left" with "0%" progress, but the API is returning:
- Current Epoch: **12**
- Epoch Progress: **49.67%**

## Quick Fix Steps

### 1. **Hard Refresh the Browser**
```
macOS: Cmd + Shift + R
```
This will clear the browser cache and force reload all assets.

### 2. **Check Browser Console**
Open DevTools (Cmd + Option + I) and look for these logs:
- ✅ `Walrus API Full Response:` - Should show the complete API data
- 📊 `Parsed Data:` - Should show extracted values
- 🔄 `Setting epochInfo to:` - Should show the epoch object being set
- 📊 `TopStatsBar received:` - Should show what the component received

### 3. **Expected Console Output**
```javascript
✅ Walrus API Full Response: {
  status: "success",
  data: {
    storage_price: 504,
    storage_capacity: { used_tb: 606.5, total_pb: 4.07, percentage: 14.55 },
    epoch_info: { current_epoch: 12, epoch_percentage_completed: 49.67 }
  }
}

📊 Parsed Data: {
  storage_price: 504,
  used_tb: 606.5,
  total_pb: 4.07,
  percentage: 14.55,
  current_epoch: 12,
  epoch_progress: 49.67,
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
  hasEpochInfo: true,
  currentEpoch: 12,
  epochProgress: 49.67
}
```

### 4. **What Should Display**
After refresh, the top bar should show:
- **Storage Used:** 606.5 TB / 4.07 PB → **14.5%** (purple bar)
- **Epoch 12:** ~7 days left → **50%** (mint/teal bar)

---

## Manual API Test

Test the API directly in your browser:
```
https://walrus-api.walrus-api.workers.dev/api/walrus/latest
```

Or from terminal:
```bash
curl -s https://walrus-api.walrus-api.workers.dev/api/walrus/latest | python3 -m json.tool
```

---

## Troubleshooting

### Issue: Still showing Epoch 0
**Solution:** The app might be using cached state. Try:
1. Stop the dev server (Ctrl+C in terminal)
2. Clear browser cache completely
3. Restart dev server: `npm run dev`
4. Hard refresh browser: Cmd+Shift+R

### Issue: API returns old data
**Solution:** The API has a cache layer. Wait 2-3 minutes for fresh data, or check `cached: true` in response.

### Issue: CORS errors in console
**Solution:** The API already has CORS enabled. If you see CORS errors, it might be a network issue. Try:
```bash
# Test from terminal to verify API is accessible
curl -i https://walrus-api.walrus-api.workers.dev/api/walrus/latest
```

### Issue: No console logs appearing
**Solution:** Make sure DevTools console is open and not filtered. Clear console and refresh.

---

## Expected UI After Fix

```
┌─────────────────────────────────────────────────────────────────────┐
│ Storage Used: 606.5 TB / 4.07 PB          Epoch 12: ~7 days left   │
│ [████████████████░░░░░░░░░░░░░░░░░] 14.5%  [████████████░░░░░░] 50%│
└─────────────────────────────────────────────────────────────────────┘
    ↑ Purple gradient bar                     ↑ Mint/teal gradient bar
```

---

## Data Flow Diagram

```
API Response
    ↓
App.jsx (fetchAllData)
    ↓
setEpochInfo({
  current_epoch: 12,
  epoch_percentage_completed: 49.67,
  storage_capacity: {...}
})
    ↓
TopStatsBar Component
    ↓
Display: "Epoch 12: ~7 days left" + 50% progress bar
```

---

## Next Steps

1. ✅ **Hard refresh browser** (Cmd+Shift+R)
2. ✅ **Open DevTools Console** (Cmd+Option+I)
3. ✅ **Verify console logs** show correct data
4. ✅ **Check UI displays** Epoch 12 with ~50% progress

If after hard refresh you still see Epoch 0, paste the console output here so I can debug further!
