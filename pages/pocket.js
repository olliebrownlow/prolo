import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import CoinList from "../components/coin-list";
import {
  getCoins,
  getConvertedAmount,
  getCurrencySettings,
  getCryptoData,
  getFiat,
} from "../actions";

const Pocket = (props) => {
  const [user] = useContext(UserContext);
  const { coinData, convertedBalanceData } = props;
  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div>
            <CoinList
              coinData={coinData}
              convertedBalanceData={convertedBalanceData}
            />
          </div>
        )
      )}
    </>
  );
};

Pocket.getInitialProps = async () => {
  const coins = await getCoins();
  const currencySettings = await getCurrencySettings();
  const fiatConvert = currencySettings[0].currencyCode.toUpperCase();

  const coinCodeArray = [];
  coins.map((coin) => {
    coinCodeArray.push(coin.code);
  });
  const coinCodes = coinCodeArray.join(",");

  const coinDataFull = await getCryptoData(coinCodes, fiatConvert);

  const amount = (code) => {
    let result = 0;
    coins.filter((coin) => {
      if (coin.code === code) {
        result = coin.amount;
      }
    });
    return result;
  };

  const coinData = coinDataFull.map((coin) => ({
    id: coin.id,
    name: coin.name.toLowerCase(),
    logo_url: coin.logo_url,
    price: coin.price,
    amount: amount(coin.id),
    total: amount(coin.id) * coin.price,
    currencyInUse: currencySettings[0].currencyCode,
  }));

  const fiatData = await getFiat();

  let convertedBalanceDataFull = [];

  await Promise.all(
    fiatData.map(async (item) => {
      convertedBalanceDataFull.push(
        await getConvertedAmount(
          item.fiatCode.toUpperCase(),
          fiatConvert,
          item.amount
        )
      );
    })
  );

  const fullFiatName = (fiatCode) => {
    let result = "unknown currency";
    fiatData.filter((fiat) => {
      if (fiat.fiatCode === fiatCode) {
        result = fiat.fiatName;
      }
    });
    return result;
  };

  const convertedBalanceData = convertedBalanceDataFull.map(
    (convertedBalance) => ({
      id: convertedBalance.response.from,
      from: convertedBalance.response.from,
      to: convertedBalance.response.to,
      amount: convertedBalance.response.amount,
      value: convertedBalance.response.value,
      fullFiatName: fullFiatName(convertedBalance.response.from.toLowerCase()),
    })
  );

  return { coinData, convertedBalanceData };
};

export default Pocket;
