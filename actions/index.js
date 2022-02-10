import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000";
const NOMICS_URL = "https://api.nomics.com/v1/currencies/ticker?key=";
const NOMICS_KEY = process.env.NOMIC_API_KEY;
const CURRENCYSCOOP_URL = "https://api.currencyscoop.com/v1/convert?api_key=";
const CURRENCYSCOOP_HISTORICAL_URL =
  "https://api.currencyscoop.com/v1/historical?api_key=";
const CURRENCYSCOOP_KEY = process.env.CURRENCYSCOOP_API_KEY;

export const getCryptoData = (coinCodes, fiatConvert) => {
  const url = `${NOMICS_URL}${NOMICS_KEY}&ids=${coinCodes}&interval=1h,1d,7d,30d,365d,ytd&convert=${fiatConvert}`;
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

export const updateCurrencySettings = (currency) => {
  return axios
    .patch(`${BASE_URL}/api/v1/currencySettings`, currency)
    .then((res) => console.log(res.data));
};

export const getThemeSettings = () => {
  return axios.get(`${BASE_URL}/api/v1/themeSettings`).then((res) => res.data);
};

export const updateThemeSettings = (theme) => {
  return axios
    .patch(`${BASE_URL}/api/v1/themeSettings`, theme)
    .then((res) => console.log(res.data));
};

export const getMrktInfoSettings = () => {
  return axios
    .get(`${BASE_URL}/api/v1/mrktInfoSettings`)
    .then((res) => res.data);
};

export const updateMrktInfoSettings = (newSetting) => {
  return axios
    .patch(`${BASE_URL}/api/v1/mrktInfoSettings`, newSetting)
    .then((res) => console.log(res.data));
};

export const getNotepadSettings = () => {
  return axios
    .get(`${BASE_URL}/api/v1/showNotepadSettings`)
    .then((res) => res.data);
};

export const updateNotepadSettings = (newSetting) => {
  return axios
    .patch(`${BASE_URL}/api/v1/showNotepadSettings`, newSetting)
    .then((res) => console.log(res.data));
};

export const getFundingData = () => {
  return axios.get(`${BASE_URL}/api/v1/fundingHistory`).then((res) => res.data);
};

export const addInvestmentItem = (item) => {
  item.id = Math.random().toString(36).substr(2, 7);

  const res = axios
    .post(`${BASE_URL}/api/v1/fundingHistory`, item)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const updateInvestmentItem = (id, correctedItem) => {
  const res = axios
    .patch(`${BASE_URL}/api/v1/fundingHistory/${id}`, correctedItem)
    .then((res) => res.data);

  toast.promise(
    res,
    {
      loading: "loading",
      success: (data) => data,
      error: (err) => err.toString(),
    },
    {
      success: {
        duration: 6000,
      },
    }
  );

  return res;
};

export const deleteInvestmentItem = (id) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/fundingHistory/${id}`)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const getCoins = (user) => {
  return axios
    .post(`${BASE_URL}/api/v1/allCoins`, user)
    .then((res) => res.data);
};

// axios does not allow get calls to pass through an argument hence the use of post
export const getCoin = (coinCodeAndUser) => {
  return axios
    .post(`${BASE_URL}/api/v1/coin`, coinCodeAndUser)
    .then((res) => res.data);
};

export const addCoin = (coin) => {
  const res = axios
    .post(`${BASE_URL}/api/v1/coins`, coin)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const updateCoin = (code, userAndNewAmount) => {
  const res = axios
    .patch(`${BASE_URL}/api/v1/coins/${code}`, userAndNewAmount)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const deleteCoin = (code, user) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/coins/${code}`, {
      data: { user: user },
    })
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const getFiat = () => {
  return axios.get(`${BASE_URL}/api/v1/fiat`).then((res) => res.data);
};

export const addFiat = (fiat) => {
  const res = axios
    .post(`${BASE_URL}/api/v1/fiat`, fiat)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const updateFiat = (code, amount) => {
  const res = axios
    .patch(`${BASE_URL}/api/v1/fiat/${code}`, amount)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const deleteFiat = (code) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/fiat/${code}`)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

// axios does not allow get calls to pass through an argument hence the use of post
export const getNotes = (filter) => {
  return axios.post(`${BASE_URL}/api/v1/notes`, filter).then((res) => res.data);
};

export const addNote = (note) => {
  note.id = Math.random().toString(36).substr(2, 7);

  const res = axios
    .post(`${BASE_URL}/api/v1/allNotes`, note)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const updateNote = (id, note) => {
  const res = axios
    .patch(`${BASE_URL}/api/v1/notes/${id}`, note)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const deleteNote = (id) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/notes/${id}`)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const deleteAssociatedNotes = (noteListArray) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/allNotes`, {
      data: { noteListArray: noteListArray },
    })
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};
