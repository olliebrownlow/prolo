import axios from "axios";

const BASE_URL = "http://localhost:3000";
const NOMICS_URL = "https://api.nomics.com/v1/currencies/ticker?key=";
const NOMICS_KEY = process.env.NOMIC_API_KEY;

export const getCryptoData = (coinCodes, fiatConvert) => {
  const url = `${NOMICS_URL}${NOMICS_KEY}&ids=${coinCodes}&convert=${fiatConvert}`;
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

export const getCoins = () => {
  return axios.get(`${BASE_URL}/api/v1/coins`).then((res) => res.data);
};

export const getFiat = () => {
  return axios.get(`${BASE_URL}/api/v1/fiat`).then((res) => res.data);
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
