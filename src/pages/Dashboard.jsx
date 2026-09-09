import { useEffect, useRef, useState } from "react";
import {
  getWallets,
  getWalletPortfolio,
  getWalletPerformance,
  getPortfolioChart,
} from "../api/chainpulse";

import PortfolioChart from "../components/PortfolioChart";
import Transactions from "../components/Transactions";
import Analytics from "../components/Analytics";

function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const [portfolio, setPortfolio] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const walletSelectorRef = useRef(null);

  useEffect(() => {
    async function loadWallets() {
      try {
        setLoading(true);
        setError("");

        const walletData = await getWallets();

        setWallets(walletData || []);

        if (walletData && walletData.length > 0) {
          setSelectedWalletId(walletData[0].id);
        } else {
          setError("No wallets found.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Wallet loading error:", err);

        setError("Unable to load wallets.");
        setLoading(false);
      }
    }

    loadWallets();
  }, []);

  useEffect(() => {
    if (!selectedWalletId) {
      return;
    }

    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [portfolioData, performanceData, chartResponse] =
          await Promise.all([
            getWalletPortfolio(selectedWalletId),
            getWalletPerformance(selectedWalletId),
            getPortfolioChart(selectedWalletId),
          ]);

        if (ignore) {
          return;
        }

        setPortfolio(portfolioData);
        setPerformance(performanceData);
        setChartData(chartResponse.data || []);
      } catch (err) {
        if (ignore) {
          return;
        }

        console.error("Dashboard loading error:", err);

        setError("Unable to load ChainPulse data.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [selectedWalletId]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        walletSelectorRef.current &&
        !walletSelectorRef.current.contains(event.target)
      ) {
        setWalletMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleWalletSelect(walletId) {
    setSelectedWalletId(walletId);
    setWalletMenuOpen(false);
  }

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId,
  );

  if (loading) {
    return (
      <main className="dashboard-state">
        <div className="loading-spinner" />

        <p>Loading ChainPulse... This might take up to a minute, please be patient</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-state">
        <h2>Something went wrong</h2>

        <p>{error}</p>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="dashboard-state">
        <h2>No portfolio data</h2>

        <p>Unable to find portfolio information for this wallet.</p>
      </main>
    );
  }

  const totalValue = Number(portfolio.total_value_usd || 0);
  const changePercent = Number(performance?.change_percent || 0);
  const changeUsd = Number(performance?.change_usd || 0);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Portfolio overview</p>

          <h1>ChainPulse</h1>

          <p className="wallet-address">Wallet #{portfolio.wallet_id}</p>
        </div>

        <div className="dashboard-header-actions">
          <div
            className={`wallet-selector ${walletMenuOpen ? "open" : ""}`}
            ref={walletSelectorRef}
          >
            <span className="wallet-selector-label">Wallet</span>

            <button
              type="button"
              className="wallet-selector-trigger"
              onClick={() => setWalletMenuOpen((current) => !current)}
              aria-expanded={walletMenuOpen}
              aria-haspopup="listbox"
            >
              <span className="wallet-selector-value">
                {selectedWallet?.label || `Wallet #${selectedWalletId}`}
              </span>

              <span className="wallet-selector-arrow">
                {walletMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {walletMenuOpen && (
              <div className="wallet-selector-menu" role="listbox">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    type="button"
                    role="option"
                    aria-selected={wallet.id === selectedWalletId}
                    className={`wallet-selector-option ${
                      wallet.id === selectedWalletId ? "selected" : ""
                    }`}
                    onClick={() => handleWalletSelect(wallet.id)}
                  >
                    <span className="wallet-option-content">
                      <strong>{wallet.label || `Wallet #${wallet.id}`}</strong>

                      <small>
                        {wallet.address
                          ? `${wallet.address.slice(
                              0,
                              6,
                            )}...${wallet.address.slice(-4)}`
                          : `Wallet #${wallet.id}`}
                      </small>
                    </span>

                    {wallet.id === selectedWalletId && (
                      <span className="wallet-option-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="network-badge">
            <span className="network-dot" />

            {portfolio.network}
          </div>
        </div>
      </header>

      <section className="portfolio-overview">
        <div className="portfolio-value-card">
          <p>Total Portfolio Value</p>

          <h2>
            $
            {totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <div className="performance-row">
            <span className={changePercent >= 0 ? "positive" : "negative"}>
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(4)}%
            </span>

            <span className="performance-usd">
              {changeUsd >= 0 ? "+" : "-"}$
              {Math.abs(changeUsd).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="wallet-card">
          <p>Wallet Address</p>

          <strong>{portfolio.address}</strong>

          <span>Ethereum Mainnet</span>
        </div>
      </section>

      <section className="summary-grid">
        <div className="summary-card">
          <p>Current Value</p>

          <strong>
            $
            {totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>

          <span>Current portfolio valuation</span>
        </div>

        <div className="summary-card">
          <p>Portfolio Change</p>

          <strong className={changePercent >= 0 ? "positive" : "negative"}>
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(4)}%
          </strong>

          <span>
            {changeUsd >= 0 ? "+" : "-"}$
            {Math.abs(changeUsd).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="summary-card">
          <p>Total Assets</p>

          <strong>{portfolio.assets.length}</strong>

          <span>
            {portfolio.assets.map((asset) => asset.symbol).join(" • ")}
          </span>
        </div>
      </section>

      <section className="chart-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio performance</p>

            <h2>Portfolio Value</h2>
          </div>

          <span>{chartData.length} snapshots</span>
        </div>

        <div className="chart-card">
          {chartData.length >= 2 ? (
            <PortfolioChart data={chartData} />
          ) : (
            <div className="chart-empty">
              <p>Not enough portfolio history yet.</p>

              <span>
                More snapshots will appear automatically every 5 minutes.
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Your assets</p>

          <h2>Portfolio Assets</h2>
        </div>

        <span>{portfolio.assets.length} assets</span>
      </section>

      <section className="asset-grid">
        {portfolio.assets.map((asset) => (
          <article
            className="asset-card"
            key={asset.token_id || asset.contract_address || asset.symbol}
          >
            <div className="asset-card-top">
              <div className="asset-icon">{asset.symbol.slice(0, 1)}</div>

              <div>
                <h3>{asset.name}</h3>

                <span>{asset.symbol}</span>
              </div>
            </div>

            <div className="asset-balance">
              {Number(asset.balance).toLocaleString("en-US", {
                maximumFractionDigits: 6,
              })}{" "}
              {asset.symbol}
            </div>

            <div className="asset-value">
              $
              {Number(asset.value_usd).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <div className="asset-footer">
              <span>
                {Number(asset.allocation_percent).toFixed(2)}% allocation
              </span>

              <span
                className={
                  Number(asset.change_24h_percent) >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {Number(asset.change_24h_percent) >= 0 ? "+" : ""}
                {Number(asset.change_24h_percent).toFixed(2)}%
              </span>
            </div>
          </article>
        ))}
      </section>

      <Analytics walletId={selectedWalletId} />

      <Transactions walletId={selectedWalletId} />
    </main>
  );
}

export default Dashboard;
