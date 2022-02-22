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

// axios does not allow get calls to pass through an argument hence the use of post
export const getCurrencyAndTheme = (user) => {
  return axios
    .get(`${BASE_URL}/api/v1/appSettings`, {
      data: { user: user, concept: "themeAndCurrency" },
    })
    .then((res) => res.data);
};

export const updateCurrencyOrThemeSettings = (userAndCurrencyOrTheme) => {
  return axios
    .patch(`${BASE_URL}/api/v1/appSettings`, userAndCurrencyOrTheme)
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

// axios does not allow get calls to pass through an argument hence the use of post
export const getFundingData = (user) => {
  return axios
    .post(`${BASE_URL}/api/v1/investmentItems`, user)
    .then((res) => res.data);
};

// axios does not allow get calls to pass through an argument hence the use of post
export const getSingleInvestmentItem = (userAnditemId) => {
  return axios
    .post(`${BASE_URL}/api/v1/investmentItem`, userAnditemId)
    .then((res) => res.data);
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

export const updateInvestmentItem = (correctedItem) => {
  const res = axios
    .patch(
      `${BASE_URL}/api/v1/fundingHistory/${correctedItem.id}`,
      correctedItem
    )
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

export const deleteInvestmentItem = (id, user) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/fundingHistory/${id}`, {
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

export const getFiats = (user) => {
  return axios
    .post(`${BASE_URL}/api/v1/allFiats`, user)
    .then((res) => res.data);
};

// axios does not allow get calls to pass through an argument hence the use of post
export const getFiat = (fiatCodeAndUser) => {
  return axios
    .post(`${BASE_URL}/api/v1/singleFiat`, fiatCodeAndUser)
    .then((res) => res.data);
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

export const updateFiat = (code, userAndNewAmount) => {
  const res = axios
    .patch(`${BASE_URL}/api/v1/fiat/${code}`, userAndNewAmount)
    .then((res) => res.data);

  toast.promise(res, {
    loading: "loading",
    success: (data) => data,
    error: (err) => err.toString(),
  });

  return res;
};

export const deleteFiat = (code, user) => {
  const res = axios
    .delete(`${BASE_URL}/api/v1/fiat/${code}`, {
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
