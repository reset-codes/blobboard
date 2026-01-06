// API Endpoints
// Walrus API Documentation:
// - Latest data: GET /api/walrus/latest
// - Historical data: GET /api/walrus/history?limit=<number>
// - Statistics: GET /api/walrus/stats
// Response structure (flat JSON):
// {
//   "storage_price": number (Frost per MiB per epoch),
//   "write_price": number (Frost per write transaction),
//   "capacity_used_tb": number,
//   "capacity_total_pb": number,
//   "capacity_percentage": number,
//   "epoch": number (current Walrus epoch),
//   "epoch_start_time": "ISO-8601 timestamp",
//   "epoch_end_time": "ISO-8601 timestamp",
//   "epoch_duration_days": number (typically 14),
//   "hours_remaining": number (pre-calculated),
//   "days_remaining": number (pre-calculated),
//   "percentage_completed": number,
//   "is_final_day": boolean
// }
export const WALRUS_API_BASE = 'https://walrus-api.walrus-api.workers.dev/api/walrus';

export const WAL_FALLBACK_PRICE = 0.25;
export const SUI_FALLBACK_PRICE = 1.0;

export const WAL_ICON = 'https://coinmeta.polymedia.app/img/coins/0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59-wal-WAL.svg';
export const SUI_ICON = 'https://coinmeta.polymedia.app/img/coins/0x0000000000000000000000000000000000000000000000000000000000000002-sui-SUI.svg';
export const BTC_ICON = 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';

export const FROST_PER_MIB_PER_EPOCH = 11000;

export const WRITE_FEE_FROST = 20000; // Cost of a single write transaction in Frost
export const MAX_FILES_PER_QUILT = 660;

export const UNIT_TO_TB = {
  TB: 1,
  GB: 1 / 1024,
  MB: 1 / (1024 * 1024),
  KB: 1 / (1024 * 1024 * 1024),
};
