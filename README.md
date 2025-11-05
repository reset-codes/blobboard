# Blob Board

A web-based storage cost calculator for the Walrus decentralized storage network. Compare costs between individual blob storage and batch quilt storage to optimize your storage expenses.

## Features

- **Real-time Pricing**: Live cryptocurrency prices (WAL, SUI, BTC) from CoinGecko API
- **Network Statistics**: Current Walrus network capacity, usage, and epoch information
- **Cost Calculator**: Calculate storage costs for your files with customizable parameters
- **Blob vs Quilt Comparison**: Side-by-side cost analysis for individual and batch storage
- **Instant Load**: Optimized initial load with default values for immediate calculations
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

## Technology Stack

- **React 19.1.0** - UI framework
- **Vite 7.0.0** - Build tool and dev server
- **Tailwind CSS 4.1.11** - Styling
- **JavaScript** - ES6+

## Installation

```bash
# Clone the repository
git clone https://github.com/reset-codes/blobboard.git

# Navigate to project directory
cd blobboard

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### Development

```bash
npm run dev
```

Runs the app in development mode at `http://localhost:5173`

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist` folder

### Preview

```bash
npm run preview
```

Preview the production build locally

## Configuration

### Storage Pricing Constants

Edit `/src/utils/constants.js` to modify default values:

- `WAL_FALLBACK_PRICE` - Default WAL price (0.25 USD)
- `SUI_FALLBACK_PRICE` - Default SUI price (1.0 USD)
- `FROST_PER_MIB_PER_EPOCH` - Default storage price (11000 frost/MiB)
- `WRITE_FEE_FROST` - Write transaction fee (20000 frost)
- `MAX_FILES_PER_QUILT` - Maximum files per quilt batch (660)

### API Endpoints

The application fetches data from:
- **CoinGecko API**: Cryptocurrency prices
- **Walrus Network API**: Network statistics and storage pricing

## Project Structure

```
blobboard/
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── TopStatsBar.jsx
│   │   ├── RevenueSection.jsx
│   │   ├── StorageCalculator.jsx
│   │   ├── CostResults.jsx
│   │   └── Footer.jsx
│   ├── utils/            # Utility functions
│   │   ├── constants.js
│   │   └── costCalculations.js
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## Cost Calculation

The calculator computes storage costs based on:

- **Storage Size**: File size in KB, MB, GB, or TB
- **Number of Files**: Quantity of files to store
- **Storage Price**: Current frost per MiB per epoch
- **Write Fees**: One-time transaction costs

### Blob Storage
Individual file uploads with separate write fees per file.

### Quilt Storage
Batch uploads supporting up to 660 files per transaction, reducing write fees significantly.

## Version History

### Version 1.1
- Added HTTP response status checks for API calls
- Optimized initial load with default values (11000 frost/MiB)
- Changed default WAL price to 0.25 USD for better accuracy
- Added division-by-zero protection in calculations
- Removed unused code and imports for cleaner codebase
- Updated write fee to use constant (20000 frost)
- Hide price ticker until API data loads
- Deleted backup files from source

### Version 1.0
- Initial release
- Basic cost calculator functionality
- Live API data integration
- Responsive mobile design

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for your own purposes.

## Credits

Created by [Reset.sui](https://x.com/Reset_sui)

## Links

- [Walrus Protocol](https://docs.walrus.site/)
- [Quilt Documentation](https://github.com/0xzoz/quilt)
- [Live Demo](https://blobboard.vercel.app/)
