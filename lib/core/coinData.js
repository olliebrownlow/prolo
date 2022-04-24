import { getCoins, getCryptoData } from "../../actions";

export const getCoinData = async (userNumber, currencyCode, type) => {
  const coins = await getCoins({ userNumber: userNumber, type: type });
  const fiatConvert = currencyCode.toUpperCase();

  const coinCodeArray = [];
  coins.map((coin) => {
    coinCodeArray.push(coin.code);
  });
  const coinCodes = coinCodeArray.join(",");

  let coinDataFull;
  if (coinCodes.length > 0) {
    coinDataFull = await getCryptoData(coinCodes, fiatConvert);
  } else {
    coinDataFull = [];
  }

  const amount = (code) => {
    let result = 0;
    coins.filter((coin) => {
      if (coin.code === code) {
        result = coin.amount;
      }
    });
    return result;
  };

  let coinData;
  // The data we want to display is dependent on coin type
  if (coinDataFull.length > 0 && type === "holding") {
    coinData = coinDataFull.map((coin) => ({
      id: coin.id,
      type: type,
      name: coin.name.toLowerCase(),
      logo_url: coin.logo_url,
      price: coin.price,
      amount: amount(coin.id),
      total: amount(coin.id) * coin.price,
      currencyInUse: currencyCode,
    }));
  } else if (coinDataFull.length > 0 && type === "monitoring") {
    coinData = coinDataFull.map((coin) => ({
      id: coin.id,
      type: type,
      name: coin.name.toLowerCase(),
      logo_url: coin.logo_url,
      price: selectRoundingMethod(coin.price),
      ath: selectRoundingMethod(coin.high),
      rank: coin.rank,
      mrktCap: coin.market_cap,
      pctOfAth: selectRoundingMethod((coin.price / coin.high) * 100),
      dPricePct: dPRounder(coin["1d"].price_change_pct * 100, 2),
      dVolPct: dPRounder(coin["1d"].volume_change_pct * 100, 2),
      currencyInUse: currencyCode,
    }));
  } else {
    coinData = [
      {
        currencyInUse: currencyCode,
      },
    ];
  }

  return coinData;
};

const selectRoundingMethod = (value) => {
  if (Number.isInteger(parseFloat(value))) {
    return value;
  }

  if (parseFloat(value) < 0.0001) {
    return dPRounder(value, 7);
  }
  if (parseFloat(value) < 0.001) {
    return dPRounder(value, 6);
  }
  if (parseFloat(value) < 0.01) {
    return dPRounder(value, 5);
  }
  if (parseFloat(value) < 0.1) {
    return dPRounder(value, 4);
  }
  if (parseFloat(value) < 1) {
    return dPRounder(value, 3);
  }
  return dPRounder(value, 2);
};

const dPRounder = (value, places) => {
  return (Math.round(value * 10 ** places) / 10 ** places).toFixed(places);
};
