import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/UserContext";
import { getCookie } from "cookies-next";
import CurrencySettingsContext from "../context/currencySettings";
import Loading from "../components/loading";
import SettingsLink from "../components/settings-link";
import CoinList from "../components/coin-list";
import FiatList from "../components/fiat-list";
import Modal from "../components/modal";
import PocketBalance from "../components/pocket-balance";
import NotLoggedIn from "../components/not-logged-in";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";
import coinSelectOptions from "../config/coinSelectOptions";
import fiatSelectOptions from "../config/fiatSelectOptions";
import styles from "../pageStyles/pocket.module.scss";

const Pocket = (props) => {
  const [user] = useContext(UserContext);
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const {
    coinData,
    fiatData,
    balances,
    userNumber,
    portfolioNumber,
    roundTo2DP,
  } = props;
  const [isCoinOptionsExhausted, setIsCoinOptionsExhausted] = useState(false);
  const [isFiatOptionsExhausted, setIsFiatOptionsExhausted] = useState(false);

  useEffect(() => {
    if (coinSelectOptions.length === coinData.length) {
      setIsCoinOptionsExhausted(true);
    }
    if (fiatSelectOptions.length === fiatData.length) {
      setIsFiatOptionsExhausted(true);
    }
  }, [coinData, fiatData]);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <SettingsLink pageName={"pocket"} />
          <div className={styles.heading}>balance</div>
          <PocketBalance
            roundTo2DP={roundTo2DP}
            balance={balances.balance}
            appCurrencySign={appCurrencySign}
          />
          <div className={styles.heading}>coin holdings</div>
          <div className={styles.balance}>
            {appCurrencySign}
            {roundTo2DP(balances.coinTotal)}
          </div>
          <Modal
            buttonText={"add coin"}
            labelName={"coin"}
            data={coinData}
            dataOptionsExhausted={isCoinOptionsExhausted}
            userNumber={userNumber}
            portfolioNumber={portfolioNumber}
            user={user.email}
            type={"holding"}
          />
          <div className={styles.subheading}>crypto</div>
          <CoinList coinData={coinData} appCurrencySign={appCurrencySign} />
          <div className={styles.subheading}>staked</div>
          <CoinList coinData={coinData} appCurrencySign={appCurrencySign} />
          <div className={styles.spacer}>placeholder</div>
          <div className={styles.heading}>fiat holdings</div>
          <div className={styles.balance}>
            {appCurrencySign}
            {roundTo2DP(balances.fiatTotal)}
          </div>
          <div className={styles.subheading}>breakdown</div>
          <Modal
            buttonText={"add fiat"}
            labelName={"fiat"}
            data={fiatData}
            dataOptionsExhausted={isFiatOptionsExhausted}
            userNumber={userNumber}
            portfolioNumber={portfolioNumber}
          />
          <FiatList
            roundTo2DP={roundTo2DP}
            fiatData={fiatData}
            appCurrencySign={appCurrencySign}
          />
        </>
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
};

export async function getServerSideProps({ req, res }) {
  const userNumber = getCookie("un", { req, res });
  const portfolioNumber = getCookie("pn", { req, res });
  const coinType = getCookie("ct", { req, res });
  const currencyCode = getCookie("cc", { req, res });
  const coinData = await getCoinData(
    userNumber,
    portfolioNumber,
    currencyCode,
    coinType
  );
  const fiatData = await getFiatData(userNumber, portfolioNumber, currencyCode);
  // console.log(coinType);
  // console.log(currencyCode);
  // console.log(fiatData);
  // console.log(coinData);

  const balances = await calculateBalance(coinData, fiatData);
  // console.log(balances);

  return {
    props: {
      coinData,
      fiatData,
      balances,
      userNumber: userNumber,
      portfolioNumber: portfolioNumber,
    },
  };
}

export default Pocket;
