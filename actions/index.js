import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getCurrencySettings = () => {
  return axios
    .get(`${BASE_URL}/api/v1/currencySettings`)
    .then((res) => res.data);
};

export const getThemeSettings = () => {
  return axios.get(`${BASE_URL}/api/v1/themeSettings`).then((res) => res.data);
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
