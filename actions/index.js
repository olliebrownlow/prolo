import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getSettings = () => {
  return axios.get(`${BASE_URL}/api/v1/settings`).then((res) => res.data);
};

export const updateCurrency = (currency) => {
  return axios
    .patch(`${BASE_URL}/api/v1/settings`, currency)
    .then((res) => res.data);
};
 
