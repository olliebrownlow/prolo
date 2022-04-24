import { getCoin, getCryptoData } from "../../actions";

export const getSingleCoinData = async (
  targetCoinCode,
  userNumber,
  currencyCode,
  type
) => {
  const coin = await getCoin({ code: targetCoinCode, userNumber: userNumber, type: type });
  const fiatConvert = currencyCode.toUpperCase();

  const coinDataFull = await getCryptoData(targetCoinCode, fiatConvert);

  const amount = () => {
    return coin.amount;
  };

  const maxSupply = (maxSupply) => {
    if (maxSupply) {
      return maxSupply;
    }
    return "no max";
  };

  const singleCoinData = coinDataFull.map((coin) => ({
    id: coin.id,
    userNumber: userNumber,
    type: type,
    name: coin.name.toLowerCase(),
    logo_url: coin.logo_url,
    price: coin.price,
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
    ytdPriceChange: coin["ytd"].price_change,
    ytdPriceChangePct: coin["ytd"].price_change_pct * 100,
    yPriceChange: coin["365d"].price_change,
    yPriceChangePct: coin["365d"].price_change_pct * 100,
    hVolume: coin["1h"].volume,
    hVolumeChange: coin["1h"].volume_change,
    hVolumeChangePct: coin["1h"].volume_change_pct * 100,
    dVolume: coin["1d"].volume,
    dVolumeChange: coin["1d"].volume_change,
    dVolumeChangePct: coin["1d"].volume_change_pct * 100,
    wVolume: coin["7d"].volume,
    wVolumeChange: coin["7d"].volume_change,
    wVolumeChangePct: coin["7d"].volume_change_pct * 100,
    mVolume: coin["30d"].volume,
    mVolumeChange: coin["30d"].volume_change,
    mVolumeChangePct: coin["30d"].volume_change_pct * 100,
    ytdVolume: coin["ytd"].volume,
    ytdVolumeChange: coin["ytd"].volume_change,
    ytdVolumeChangePct: coin["ytd"].volume_change_pct * 100,
    yVolume: coin["365d"].volume,
    yVolumeChange: coin["365d"].volume_change,
    yVolumeChangePct: coin["365d"].volume_change_pct * 100,
  }));

  if (type === "holding") {
    singleCoinData[0].amount = amount();
    singleCoinData[0].total = amount() * singleCoinData[0].price;
  }

  return singleCoinData;
};
