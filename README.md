# ChainPulse

ChainPulse is a full stack blockchain portfolio analytics platform designed to monitor Ethereum wallets, transactions, token holdings, portfolio value, performance, and historical portfolio data.

This repository contains the **ChainPulse frontend**, built with React and Vite and connected to the ChainPulse Rust backend API.

## 🚀 Live Application

**ChainPulse Dashboard:**  
https://chainpulse-frontend.onrender.com

**Production API:**  
https://chainpulse-backend-5nqj.onrender.com

## 🔗 Project Repositories

### Frontend

https://github.com/mikeisresilient/chainpulse-frontend

### Backend

https://github.com/mikeisresilient/chainpulse-backend

---

# Features

## Wallet Management

- Add and track Ethereum wallets
- View wallet addresses
- View wallet labels
- View ETH balances
- View supported token balances
- View wallet network information

## Portfolio Tracking

- Real time Ethereum balance
- ERC20 token balances
- USDC support
- USD portfolio valuation
- Asset allocation percentages
- 24 hour asset price changes
- Total portfolio value
- Portfolio asset breakdown

## Transaction Tracking

- Transaction history
- Incoming transactions
- Outgoing transactions
- Transaction status
- Transaction values
- Gas fees
- Gas prices
- Gas used
- Block numbers
- Transaction timestamps
- Transaction pagination
- Individual transaction details

## Analytics

ChainPulse provides wallet level analytics including:

- Total transaction count
- Incoming transaction count
- Outgoing transaction count
- Total ETH received
- Total ETH sent
- Total gas spent
- Current wallet balance

## Portfolio Performance

- Current portfolio value
- Previous portfolio value
- Portfolio change in USD
- Portfolio change percentage
- Historical portfolio values
- Portfolio performance tracking

## Portfolio History

ChainPulse automatically stores portfolio snapshots and uses them to generate historical portfolio data.

The backend periodically records portfolio values so the frontend can display portfolio changes over time.

## Portfolio Chart

The dashboard provides historical portfolio chart data based on saved portfolio snapshots.

## Market Data

ChainPulse retrieves market data for supported assets including:

- Ethereum
- USD Coin

Market information includes:

- Current USD price
- 24 hour price change
- Portfolio asset valuation

## Market Price Resilience

ChainPulse uses a market price cache to prevent temporary market API failures from breaking portfolio calculations.

When live market data is available:

```text
CoinGecko
    ↓
Current market prices
    ↓
PostgreSQL price cache
    ↓
Portfolio calculation
````

If CoinGecko temporarily becomes unavailable or returns a rate limit response:

```text
CoinGecko
    ↓
429 / temporary failure
    ↓
Cached market prices
    ↓
Portfolio calculation continues
```

This makes the portfolio system more resilient to external API rate limits.

---

# Responsive Design

The ChainPulse dashboard is designed to work across different screen sizes.

The interface has been tested across:

* Mobile phones
* Tablets
* Laptops
* Desktops
* Large screens

The UI is designed to prevent:

* Horizontal overflow
* Broken layouts
* Cut off charts
* Overlapping content
* Inaccessible buttons
* Broken navigation

---

# Architecture

```text
                    ┌────────────────────────┐
                    │   ChainPulse Frontend  │
                    │                        │
                    │      React + Vite      │
                    └────────────┬───────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌────────────────────────┐
                    │   ChainPulse Backend   │
                    │                        │
                    │       Rust + Axum      │
                    └────────────┬───────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               │                 │                 │
               ▼                 ▼                 ▼
      ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
      │   Supabase     │ │  Ethereum    │ │   Etherscan    │
      │   PostgreSQL   │ │     RPC      │ │      API       │
      └────────────────┘ └──────────────┘ └────────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │    CoinGecko     │
                       │   Market Data    │
                       └──────────────────┘
```

---

# Tech Stack

## Frontend

* React
* Vite
* JavaScript
* Axios
* CSS

## Backend

* Rust
* Axum
* Tokio
* SQLx
* Reqwest
* Serde
* Alloy

## Database

* PostgreSQL
* Supabase
* SQLx migrations

## Blockchain

* Ethereum
* Ethereum RPC
* Etherscan API
* ERC20 token support

## Market Data

* CoinGecko API
* PostgreSQL market price cache

## Deployment

* GitHub
* Render
* Supabase

---

# 📁 Project Structure

```text
chainpulse-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

---

# Environment Variables

The frontend uses Vite environment variables to configure the backend API.

Create a `.env` file in the project root.

For local development:

```env
VITE_API_BASE_URL=http://127.0.0.1:3000
```

For production:

```env
VITE_API_BASE_URL=https://chainpulse-backend-5nqj.onrender.com
```

The repository contains an `.env.example` file that provides a safe configuration template.

## Environment File Security

Never commit:

```text
.env
.env.local
.env.*.local
```

These files are excluded through `.gitignore`.

### Important

Any Vite environment variable beginning with `VITE_` is exposed to the browser during the production build.

Therefore, never put:

* Database passwords
* Private keys
* Secret API keys
* Supabase service role keys
* Blockchain private credentials

inside frontend environment variables.

---

# Local Development

## 1. Clone the Repository

```bash
git clone https://github.com/mikeisresilient/chainpulse-frontend.git
```

## 2. Enter the Project

```bash
cd chainpulse-frontend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure the API

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:3000
```

Make sure the ChainPulse backend is running locally.

## 5. Start the Development Server

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173
```

---

# 🏭 Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be placed in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# Deployment

The ChainPulse frontend is deployed as a Render Static Site.

## Repository

```text
mikeisresilient/chainpulse-frontend
```

## Branch

```text
main
```

## Build Command

```bash
npm install && npm run build
```

## Publish Directory

```text
dist
```

## Production Environment Variable

```text
VITE_API_BASE_URL=https://chainpulse-backend-5nqj.onrender.com
```

Every push to the `main` branch can trigger a new Render deployment.

---

# API Integration

The frontend communicates with the ChainPulse backend using Axios.

The API base URL is configured through:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:3000";
```

This allows the same frontend codebase to work in both development and production.

## Available API Endpoints

### Health

```http
GET /api/health
```

### Wallets

```http
GET /api/wallets
POST /api/wallets
GET /api/wallets/{id}
GET /api/wallets/{id}/balance
```

### Tokens

```http
GET /api/tokens
POST /api/tokens
GET /api/wallets/{id}/tokens
```

### Transactions

```http
GET /api/wallets/{id}/transactions
GET /api/wallets/{wallet_id}/transactions/{transaction_id}
```

### Analytics

```http
GET /api/wallets/{id}/analytics
```

### Portfolio

```http
GET /api/wallets/{id}/portfolio
GET /api/wallets/{id}/portfolio/history
GET /api/wallets/{id}/portfolio/performance
GET /api/wallets/{id}/portfolio/chart
```

---

# Portfolio Data

The dashboard retrieves portfolio data dynamically from the ChainPulse backend.

Example supported assets:

```text
Ethereum
USD Coin
```

Example portfolio structure:

```text
Ethereum
Balance: 109094.2699 ETH
Allocation: 97.18%

USD Coin
Balance: 7747917.255736 USDC
Allocation: 2.82%
```

The actual values displayed by the application are retrieved dynamically from the production API and can change as blockchain balances and market prices change.

---

# Portfolio Snapshot System

The ChainPulse backend automatically creates portfolio snapshots.

The process works approximately every five minutes:

```text
Every 5 minutes
      ↓
Find wallets
      ↓
Calculate portfolio value
      ↓
Save portfolio snapshot
      ↓
Update historical data
```

These snapshots are used by the frontend for:

* Portfolio history
* Performance calculations
* Historical charts
* Portfolio change tracking

---

# Security

The frontend does not store private blockchain keys or database credentials.

Sensitive backend configuration is handled by the backend environment.

Frontend environment variables should only contain values that are safe to expose to the browser.

Never commit:

```text
.env
.env.local
.env.*.local
```

---

# Production Verification

The deployed ChainPulse application has been tested successfully for:

* Frontend deployment
* Backend connectivity
* Database connectivity
* Wallet retrieval
* Ethereum RPC connectivity
* Etherscan transaction retrieval
* ETH balance retrieval
* USDC balance retrieval
* Portfolio valuation
* Asset allocation
* Transaction history
* Wallet analytics
* Portfolio performance
* Portfolio history
* Portfolio chart
* Market price caching
* Background portfolio snapshots
* CORS configuration
* Production API communication
* Responsive layouts

---

# Future Improvements

Potential future improvements include:

* Additional blockchain networks
* Additional ERC20 token support
* Multiple wallet management
* Wallet search
* User authentication
* Portfolio alerts
* Advanced portfolio analytics
* More interactive charts
* Wallet comparison
* Portfolio comparison
* Additional market data providers
* Improved API caching
* Improved frontend code splitting
* Progressive Web App support
* Custom domain
* Enhanced loading states
* Enhanced error handling
* More advanced dashboard customization

---

# 👨Author

## Michael Uchechukwu Ege

Blockchain Developer • Full Stack Developer • Web3 Educator

GitHub:

[https://github.com/mikeisresilient]

---

# License

This project is currently intended as a portfolio and development project.
