import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/UserContext";
import CurrencySettingsContext from "../context/currencySettings";
import Loading from "../components/loading";
import SettingsLink from "../components/settings-link";
import CoinList from "../components/coin-list";
import FiatList from "../components/fiat-list";
import Modal from "../components/modal";
import PocketBalance from "../components/pocket-balance";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import coinSelectOptions from "../config/coinSelectOptions";
import fiatSelectOptions from "../config/fiatSelectOptions";
import styles from "../pageStyles/pocket.module.scss";

const Pocket = (props) => {
  const [user] = useContext(UserContext);
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { coinData, fiatData, roundTo2DP } = props;
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
      ) : (
        user?.issuer && (
          <>
            <SettingsLink />
            <div className={styles.heading}>balance</div>
            <PocketBalance
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              fiatData={fiatData}
              appCurrencySign={appCurrencySign}
            />
            <div className={styles.heading}>coin holdings</div>
            <Modal
              buttonText={"add coin"}
              labelName={"coin"}
              data={coinData}
              dataOptionsExhausted={isCoinOptionsExhausted}
              userEmail={user.email}
            />
            <CoinList
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              appCurrencySign={appCurrencySign}
            />
            <div className={styles.spacer}>placeholder</div>
            <div className={styles.heading}>fiat holdings</div>
            <Modal
              buttonText={"add fiat"}
              labelName={"fiat"}
              data={fiatData}
              dataOptionsExhausted={isFiatOptionsExhausted}
              userEmail={user.email}
            />
            <FiatList
              roundTo2DP={roundTo2DP}
              fiatData={fiatData}
              appCurrencySign={appCurrencySign}
            />
          </>
        )
      )}
    </>
  );
};

export async function getServerSideProps() {
  const coinData = await getCoinData();
  const fiatData = await getFiatData();
  // console.log(fiatData);
  // console.log(coinData);

  return {
    props: {
      coinData,
      fiatData,
    },
  };
}

export default Pocket;
