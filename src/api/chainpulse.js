import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:3000";
  
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getWallets() {
  const response = await api.get("/api/wallets");

  return response.data;
}

export async function getWalletPortfolio(walletId) {
  const response = await api.get(
    `/api/wallets/${walletId}/portfolio`,
  );

  return response.data;
}

export async function getWalletAnalytics(walletId) {
  const response = await api.get(
    `/api/wallets/${walletId}/analytics`,
  );

  return response.data;
}

export async function getWalletPerformance(walletId) {
  const response = await api.get(
    `/api/wallets/${walletId}/portfolio/performance`,
  );

  return response.data;
}

export async function getPortfolioHistory(
  walletId,
  page = 1,
  limit = 50,
) {
  const response = await api.get(
    `/api/wallets/${walletId}/portfolio/history`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
}

export async function getPortfolioChart(walletId) {
  const response = await api.get(
    `/api/wallets/${walletId}/portfolio/chart`,
  );

  return response.data;
}

export async function getWalletTransactions(
  walletId,
  page = 1,
  limit = 20,
  direction,
) {
  const response = await api.get(
    `/api/wallets/${walletId}/transactions`,
    {
      params: {
        page,
        limit,
        ...(direction ? { direction } : {}),
      },
    },
  );

  return response.data;
}

export async function getWalletTransaction(walletId, transactionId) {
  const response = await api.get(
    `/api/wallets/${walletId}/transactions/${transactionId}`,
  );

  return response.data;
}

export default api;