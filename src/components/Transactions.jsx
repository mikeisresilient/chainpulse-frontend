import { useEffect, useState } from "react";
import { getWalletTransaction, getWalletTransactions } from "../api/chainpulse";

function Transactions({ walletId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [direction, setDirection] = useState("");

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetailsLoading, setTransactionDetailsLoading] =
    useState(false);
  const [transactionDetailsError, setTransactionDetailsError] = useState("");

  async function handleTransactionClick(transactionId) {
    try {
      setTransactionDetailsLoading(true);
      setTransactionDetailsError("");
      setSelectedTransaction(null);

      const data = await getWalletTransaction(walletId, transactionId);

      setSelectedTransaction(data);
    } catch (err) {
      console.error("Transaction details error:", err);

      setTransactionDetailsError("Unable to load transaction details.");
    } finally {
      setTransactionDetailsLoading(false);
    }
  }

  useEffect(() => {
    if (!walletId) {
      return;
    }

    let ignore = false;

    async function loadTransactions() {
      try {
        setLoading(true);
        setError("");

        const data = await getWalletTransactions(walletId, page, 10, direction);

        if (ignore) {
          return;
        }

        setTransactions(data.transactions || []);
        setPages(data.pages || 1);
        setTotal(data.total || 0);
      } catch (err) {
        if (ignore) {
          return;
        }

        console.error("Transactions error:", err);

        setError("Unable to load transactions.");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      ignore = true;
    };
  }, [walletId, page, direction]);

  function shortenAddress(address) {
    if (!address) {
      return "Unknown";
    }

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function shortenHash(hash) {
    if (!hash) {
      return "Unknown";
    }

    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  }

  function formatValue(value) {
    const number = Number(value || 0);

    return `${number.toLocaleString("en-US", {
      maximumFractionDigits: 6,
    })} ETH`;
  }

  function formatGas(value) {
    const number = Number(value || 0);

    return `${number.toFixed(8)} ETH`;
  }

  function formatDate(timestamp) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(timestamp * 1000));
  }

  function getDirectionClass(transactionDirection) {
    return transactionDirection === "incoming" ? "incoming" : "outgoing";
  }

  function handleDirectionChange(newDirection) {
    setSelectedTransaction(null);
    setTransactionDetailsError("");
    setTransactionDetailsLoading(false);

    setPage(1);
    setDirection(newDirection);
  }

  function handlePreviousPage() {
    setSelectedTransaction(null);
    setTransactionDetailsError("");
    setTransactionDetailsLoading(false);

    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function handleNextPage() {
    setSelectedTransaction(null);
    setTransactionDetailsError("");
    setTransactionDetailsLoading(false);

    setPage((currentPage) => Math.min(currentPage + 1, pages));
  }

  if (loading) {
    return (
      <section className="transactions-section">
        <div className="transactions-header">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Activity</p>

              <h2>Transactions</h2>
            </div>

            <span>{total.toLocaleString("en-US")} transactions</span>
          </div>

          <div className="transaction-filters">
            <button
              type="button"
              className={direction === "" ? "active" : ""}
              onClick={() => handleDirectionChange("")}
            >
              All
            </button>

            <button
              type="button"
              className={direction === "incoming" ? "active" : ""}
              onClick={() => handleDirectionChange("incoming")}
            >
              Incoming
            </button>

            <button
              type="button"
              className={direction === "outgoing" ? "active" : ""}
              onClick={() => handleDirectionChange("outgoing")}
            >
              Outgoing
            </button>
          </div>
        </div>

        <div className="transactions-card">
          <div className="transactions-state">Loading transactions...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="transactions-section">
        <div className="transactions-header">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Activity</p>

              <h2>Transactions</h2>
            </div>

            <span>{total.toLocaleString("en-US")} transactions</span>
          </div>

          <div className="transaction-filters">
            <button
              type="button"
              className={direction === "" ? "active" : ""}
              onClick={() => handleDirectionChange("")}
            >
              All
            </button>

            <button
              type="button"
              className={direction === "incoming" ? "active" : ""}
              onClick={() => handleDirectionChange("incoming")}
            >
              Incoming
            </button>

            <button
              type="button"
              className={direction === "outgoing" ? "active" : ""}
              onClick={() => handleDirectionChange("outgoing")}
            >
              Outgoing
            </button>
          </div>
        </div>

        <div className="transactions-card">
          <div className="transactions-state">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="transactions-section">
      <div className="transactions-header">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Activity</p>

            <h2>Transactions</h2>
          </div>

          <span>{total.toLocaleString("en-US")} transactions</span>
        </div>

        <div className="transaction-filters">
          <button
            type="button"
            className={direction === "" ? "active" : ""}
            onClick={() => handleDirectionChange("")}
          >
            All
          </button>

          <button
            type="button"
            className={direction === "incoming" ? "active" : ""}
            onClick={() => handleDirectionChange("incoming")}
          >
            Incoming
          </button>

          <button
            type="button"
            className={direction === "outgoing" ? "active" : ""}
            onClick={() => handleDirectionChange("outgoing")}
          >
            Outgoing
          </button>
        </div>
      </div>

      {transactionDetailsLoading && (
        <div className="transaction-details-card">
          <div className="transactions-state">
            Loading transaction details...
          </div>
        </div>
      )}

      {transactionDetailsError && (
        <div className="transaction-details-card">
          <div className="transactions-state">{transactionDetailsError}</div>
        </div>
      )}

      {selectedTransaction && !transactionDetailsLoading && (
        <div className="transaction-details-card">
          <div className="transaction-details-header">
            <div>
              <p className="eyebrow">Transaction Details</p>

              <h3>{shortenHash(selectedTransaction.hash)}</h3>
            </div>

            <button
              type="button"
              className="transaction-details-close"
              onClick={() => {
                setSelectedTransaction(null);
                setTransactionDetailsError("");
              }}
            >
              Close
            </button>
          </div>

          <div className="transaction-details-grid">
            <div>
              <span>Transaction Hash</span>

              <strong>{selectedTransaction.hash}</strong>
            </div>

            <div>
              <span>Status</span>

              <strong>{selectedTransaction.status}</strong>
            </div>

            <div>
              <span>Direction</span>

              <strong>{selectedTransaction.direction}</strong>
            </div>

            <div>
              <span>Block</span>

              <strong>{selectedTransaction.block_number}</strong>
            </div>

            <div>
              <span>From</span>

              <strong>{selectedTransaction.from_address}</strong>
            </div>

            <div>
              <span>To</span>

              <strong>{selectedTransaction.to_address}</strong>
            </div>

            <div>
              <span>Value</span>

              <strong>{formatValue(selectedTransaction.value_eth)}</strong>
            </div>

            <div>
              <span>Gas Used</span>

              <strong>{selectedTransaction.gas_used}</strong>
            </div>

            <div>
              <span>Gas Price</span>

              <strong>{selectedTransaction.gas_price_gwei} Gwei</strong>
            </div>

            <div>
              <span>Gas Fee</span>

              <strong>{formatGas(selectedTransaction.gas_fee_eth)}</strong>
            </div>

            <div>
              <span>Timestamp</span>

              <strong>{formatDate(selectedTransaction.timestamp)}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="transactions-card">
        {transactions.length > 0 ? (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Direction</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                  <th>Gas Fee</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="transaction-id">
                        <span
                          className={`transaction-icon ${getDirectionClass(
                            transaction.direction,
                          )}`}
                        >
                          {transaction.direction === "incoming" ? "↓" : "↑"}
                        </span>

                        <button
                          type="button"
                          className="transaction-hash-button"
                          title={`View transaction ${transaction.hash}`}
                          onClick={() => handleTransactionClick(transaction.id)}
                        >
                          {shortenHash(transaction.hash)}
                        </button>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`direction-badge ${getDirectionClass(
                          transaction.direction,
                        )}`}
                      >
                        {transaction.direction}
                      </span>
                    </td>

                    <td title={transaction.from_address}>
                      {shortenAddress(transaction.from_address)}
                    </td>

                    <td title={transaction.to_address}>
                      {shortenAddress(transaction.to_address)}
                    </td>

                    <td className="transaction-value">
                      {formatValue(transaction.value_eth)}
                    </td>

                    <td>{formatGas(transaction.gas_fee_eth)}</td>

                    <td>
                      <span
                        className={
                          transaction.status === "success"
                            ? "status-badge success"
                            : "status-badge failed"
                        }
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td>{formatDate(transaction.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="transactions-state">No transactions found.</div>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {page} of {pages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={page === pages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default Transactions;
