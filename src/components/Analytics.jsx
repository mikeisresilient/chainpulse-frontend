import { useEffect, useState } from "react";
import { getWalletAnalytics } from "../api/chainpulse";

function Analytics({ walletId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!walletId) {
      return;
    }

    let ignore = false;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const data = await getWalletAnalytics(walletId);

        if (ignore) {
          return;
        }

        setAnalytics(data);
      } catch (err) {
        if (ignore) {
          return;
        }

        console.error("Analytics error:", err);

        setError("Unable to load wallet analytics.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      ignore = true;
    };
  }, [walletId]);

  function formatEth(value) {
    const number = Number(value || 0);

    return `${number.toLocaleString("en-US", {
      maximumFractionDigits: 6,
    })} ETH`;
  }

  if (loading) {
    return (
      <section className="analytics-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Wallet Insights</p>

            <h2>Analytics</h2>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-state">Loading analytics...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Wallet Insights</p>

            <h2>Analytics</h2>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-state">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <section className="analytics-section analytics-section-spaced">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Wallet Insights</p>

          <h2>Analytics</h2>
        </div>

        <span>{analytics.network}</span>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <p>Transactions</p>

          <strong>{analytics.transaction_count.toLocaleString("en-US")}</strong>

          <span>Total wallet transactions</span>
        </div>

        <div className="analytics-card">
          <p>Incoming</p>

          <strong className="positive">
            {analytics.incoming_count.toLocaleString("en-US")}
          </strong>

          <span>Transactions received</span>
        </div>

        <div className="analytics-card">
          <p>Outgoing</p>

          <strong className="negative">
            {analytics.outgoing_count.toLocaleString("en-US")}
          </strong>

          <span>Transactions sent</span>
        </div>

        <div className="analytics-card">
          <p>Current ETH Balance</p>

          <strong>{formatEth(analytics.balance_eth)}</strong>

          <span>Current native asset balance</span>
        </div>

        <div className="analytics-card">
          <p>Total Received</p>

          <strong>{formatEth(analytics.total_received_eth)}</strong>

          <span>ETH received by wallet</span>
        </div>

        <div className="analytics-card">
          <p>Total Sent</p>

          <strong>{formatEth(analytics.total_sent_eth)}</strong>

          <span>ETH sent by wallet</span>
        </div>

        <div className="analytics-card">
          <p>Gas Spent</p>

          <strong>{formatEth(analytics.total_gas_spent_eth)}</strong>

          <span>Total transaction gas</span>
        </div>

        <div className="analytics-card">
          <p>Wallet Network</p>

          <strong className="capitalize">{analytics.network}</strong>

          <span>Connected blockchain network</span>
        </div>
      </div>
    </section>
  );
}

export default Analytics;
