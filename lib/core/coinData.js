import { getCoins, getCryptoData } from "../../actions";

export const getCoinData = async (user, currencyCode) => {
  const coins = await getCoins({ user: user });
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
  if (coinDataFull.length > 0) {
    coinData = coinDataFull.map((coin) => ({
      id: coin.id,
      name: coin.name.toLowerCase(),
      logo_url: coin.logo_url,
      price: coin.price,
      amount: amount(coin.id),
      total: amount(coin.id) * coin.price,
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
