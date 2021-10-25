import axios from "axios";

const BASE_URL = "http://localhost:3000";
const NOMICS_URL = "https://api.nomics.com/v1/currencies/ticker?key=";
const NOMICS_KEY = process.env.NOMIC_API_KEY;
const CURRENCYSCOOP_URL = "https://api.currencyscoop.com/v1/convert?api_key=";
const CURRENCYSCOOP_HISTORICAL_URL =
  "https://api.currencyscoop.com/v1/historical?api_key=";
const CURRENCYSCOOP_KEY = process.env.CURRENCYSCOOP_API_KEY;

export const getCryptoData = (coinCodes, fiatConvert) => {
  const url = `${NOMICS_URL}${NOMICS_KEY}&ids=${coinCodes}&convert=${fiatConvert}`;
  return axios.get(url).then((res) => res.data);
};

export const getConvertedAmount = (fromCurrency, toCurrency, amount) => {
  const url = `${CURRENCYSCOOP_URL}${CURRENCYSCOOP_KEY}&from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
  return axios.get(url).then((res) => res.data);
};

export const getHistoricalData = (currencyCode, date) => {
  const url = `${CURRENCYSCOOP_HISTORICAL_URL}${process.env.PRIVATE_CURRENCYSCOOP_API_KEY}&base=${currencyCode}&date=${date}&symbols=EUR,GBP,USD`;
  return axios.get(url).then((res) => res.data);
};

export const getCurrencySettings = () => {
  return axios
    .get(`${BASE_URL}/api/v1/currencySettings`)
    .then((res) => res.data);
};

export const getThemeSettings = () => {
  return axios.get(`${BASE_URL}/api/v1/themeSettings`).then((res) => res.data);
};

export const getFundingData = () => {
  return axios.get(`${BASE_URL}/api/v1/fundingHistory`).then((res) => res.data);
};

export const getCoins = () => {
  return axios.get(`${BASE_URL}/api/v1/coins`).then((res) => res.data);
};

export const getCoinByCode = (code) => {
  return axios.get(`${BASE_URL}/api/v1/coins/${code}`).then((res) => res.data);
};

export const getFiat = () => {
  return axios.get(`${BASE_URL}/api/v1/fiat`).then((res) => res.data);
};

export const addInvestmentItem = (item) => {
  item.id = Math.random().toString(36).substr(2, 7);

  return axios
    .post(`${BASE_URL}/api/v1/fundingHistory`, item)
    .then((res) => res.data);
};

export const addCoin = (coin) => {
  return axios.post(`${BASE_URL}/api/v1/coins`, coin).then((res) => res.data);
};

export const addFiat = (fiat) => {
  return axios.post(`${BASE_URL}/api/v1/fiat`, fiat).then((res) => res.data);
};

export const updateCoin = (code, amount) => {
  return axios
    .patch(`${BASE_URL}/api/v1/coins/${code}`, amount)
    .then((res) => console.log(res.data));
};

export const updateFiat = (code, amount) => {
  return axios
    .patch(`${BASE_URL}/api/v1/fiat/${code}`, amount)
    .then((res) => console.log(res.data));
};

export const updateCurrencySettings = (currency) => {
  return axios
    .patch(`${BASE_URL}/api/v1/currencySettings`, currency)
    .then((res) => console.log(res.data));
};

export const updateThemeSettings = (theme) => {
  return axios
    .patch(`${BASE_URL}/api/v1/themeSettings`, theme)
    .then((res) => console.log(res.data));
};

export const deleteCoin = (code) => {
  return axios
    .delete(`${BASE_URL}/api/v1/coins/${code}`)
    .then((res) => res.data);
};

export const deleteFiat = (code) => {
  return axios
    .delete(`${BASE_URL}/api/v1/fiat/${code}`)
    .then((res) => res.data);
};
