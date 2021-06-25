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
  // console.log(coinData);
  // console.log(fiatData);

  let convertedBalanceData = [];

  await Promise.all(
    fiatData.map(async (item) => {
      convertedBalanceData.push(
        await getConvertedAmount(
          item.fiatCode.toUpperCase(),
          fiatConvert,
          item.amount
        )
      );
    })
  );

  // console.log(convertedBalanceData);

  return { coinData, convertedBalanceData };
};

export default Pocket;
