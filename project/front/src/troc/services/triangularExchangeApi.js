import axios from "axios";

const API = "http://localhost:8080/troc/triangular-exchanges";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTriangularExchange = async (payload) => {
  const res = await axios.post(API, payload, authHeader());
  return res.data;
};

export const autoCreateTriangularExchange = async (wantedProductId) => {
  const res = await axios.post(
    `${API}?wantedProductId=${wantedProductId}`,
    {},
    authHeader(),
  );
  return res.data;
};

export const acceptExchange = async (exchangeId) => {
  await axios.post(`${API}/${exchangeId}/accept`, {}, authHeader());
};

export const refuseExchange = async (exchangeId) => {
  await axios.post(`${API}/${exchangeId}/refuse`, {}, authHeader());
};

export const confirmExchange = async (exchangeId) => {
  await axios.post(`${API}/${exchangeId}/confirm`, {}, authHeader());
};
