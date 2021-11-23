import { getCoins, getCurrencySettings, getCryptoData } from "../../actions";

export const getCoinData = async () => {
  const coins = await getCoins();
  const currencySettings = await getCurrencySettings();
  const fiatConvert = currencySettings[0].currencyCode.toUpperCase();

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

  const maxSupply = (maxSupply) => {
    // let result = "no maximum";
    // coins.filter((coin) => {
    if (maxSupply) {
      return maxSupply;
    }
    // });
    return "no maximum";
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
      high: coin.high,
      rank: coin.rank,
      firstTrade: coin.first_trade,
      highDate: coin.high_timestamp,
      marketCap: coin.market_cap,
      supply: coin.circulating_supply,
      maxSupply: maxSupply(coin.max_supply),
      hPriceChange: coin["1h"].price_change,
      hPriceChangePct: coin["1h"].price_change_pct * 100,
      dPriceChange: coin["1d"].price_change,
      dPriceChangePct: coin["1d"].price_change_pct * 100,
      wPriceChange: coin["7d"].price_change,
      wPriceChangePct: coin["7d"].price_change_pct * 100,
      mPriceChange: coin["30d"].price_change,
      mPriceChangePct: coin["30d"].price_change_pct * 100,
      yPriceChange: coin["365d"].price_change,
      yPriceChangePct: coin["365d"].price_change_pct * 100,
      currencyInUse: currencySettings[0].currencyCode,
    }));
  } else {
    coinData = [
      {
        currencyInUse: currencySettings[0].currencyCode,
      },
    ];
  }

  return coinData;
};
