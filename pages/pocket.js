import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import CoinList from "../components/coin-list";
import FiatList from "../components/fiat-list";
import Modal from "../components/modal";
import PocketBalance from "../components/pocket-balance";
import Link from "next/link";
import {
  getCoins,
  getConvertedAmount,
  getCurrencySettings,
  getCryptoData,
  getFiat,
} from "../actions";
import styles from "../pageStyles/pocket.module.scss";

const Pocket = (props) => {
  const [user] = useContext(UserContext);
  const { coinData, convertedBalanceData, settingsCurrencySign } = props;

  const roundTo2DP = (unrounded) => {
    return (Math.round(unrounded * 100) / 100).toFixed(2);
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.pocketLayout}>
            <Link href="/settings">
              <img
                className={styles.currencyImg}
                src={`./${coinData[0].currencyInUse}Flag.jpg`}
                alt={coinData[0].currencyInUse}
              />
            </Link>
            <div className={styles.heading}>balance</div>
            <PocketBalance
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              convertedBalanceData={convertedBalanceData}
              settingsCurrencySign={settingsCurrencySign}
            />
            <div className={styles.heading}>coin holdings</div>
            <Modal buttonText={"add coin"} labelName={"coin"} data={coinData} />
            <CoinList
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              settingsCurrencySign={settingsCurrencySign}
            />
            <div className={styles.heading}>fiat holdings</div>
            <Modal
              buttonText={"add fiat"}
              labelName={"fiat"}
              data={convertedBalanceData}
            />
            <FiatList
              roundTo2DP={roundTo2DP}
              convertedBalanceData={convertedBalanceData}
              settingsCurrencySign={settingsCurrencySign}
            />
          </div>
        )
      )}
    </>
  );
};

export async function getServerSideProps() {
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

  let coinData;
  if (coinDataFull.length > 0) {
    coinData = coinDataFull.map((coin) => ({
      id: coin.id,
      name: coin.name.toLowerCase(),
      logo_url: coin.logo_url,
      price: coin.price,
      amount: amount(coin.id),
      total: amount(coin.id) * coin.price,
      currencyInUse: currencySettings[0].currencyCode,
    }));
  } else {
    coinData = [
      {
        currencyInUse: currencySettings[0].currencyCode,
      },
    ];
  }

  const fiatData = await getFiat();

  let convertedBalanceDataFull = [];

  await Promise.all(
    fiatData.map(async (item) => {
      convertedBalanceDataFull.push(
        await getConvertedAmount(item.code, fiatConvert, item.amount)
      );
    })
  );

  const fullFiatName = (fiatCode) => {
    let result = "unknown currency";
    fiatData.filter((fiat) => {
      if (fiat.code === fiatCode) {
        result = fiat.name;
      }
    });
    return result;
  };

  const fiatSign = (fiatCode) => {
    let result = "";
    fiatData.filter((fiat) => {
      if (fiat.code === fiatCode) {
        result = fiat.sign;
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
      fullFiatName: fullFiatName(convertedBalance.response.from),
      fiatSign: fiatSign(convertedBalance.response.from),
    })
  );

  const settingsCurrencySign = currencySettings[0].sign;

  // console.log(coinData);
  // console.log(convertedBalanceData);
  // console.log(settingsCurrencySign);

  return {
    props: {
      coinData,
      convertedBalanceData,
      settingsCurrencySign,
    },
  };
}

export default Pocket;
