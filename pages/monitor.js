import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/UserContext";
import { getCoinData } from "../lib/core/coinData";
import { getCookie } from "cookies-next";
import CurrencySettingsContext from "../context/currencySettings";
import Loading from "../components/loading";
import CoinMonitoredList from "../components/coin-monitored-list";
import Modal from "../components/modal";
import SettingsLink from "../components/settings-link";
import coinSelectOptions from "../config/coinSelectOptions";
import styles from "../pageStyles/monitor.module.scss";

const Monitor = (props) => {
  const [user] = useContext(UserContext);
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { coinData, roundTo2DP } = props;
  const [isCoinOptionsExhausted, setIsCoinOptionsExhausted] = useState(false);

  useEffect(() => {
    if (coinSelectOptions.length === coinData.length) {
      setIsCoinOptionsExhausted(true);
    }
  }, [coinData]);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <>
            <SettingsLink />
            <div className={styles.heading}>coins</div>
            <Modal
              buttonText={"add coin"}
              labelName={"coin"}
              data={coinData}
              dataOptionsExhausted={isCoinOptionsExhausted}
              userEmail={user.email}
              type={"monitoring"}
            />
            <CoinMonitoredList
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              appCurrencySign={appCurrencySign}
            />
          </>
        )
      )}
    </>
  );
};

export async function getServerSideProps({ req, res }) {
  const user = getCookie("ue", { req, res });
  const coinType = getCookie("ct", { req, res });
  const currencyCode = getCookie("cc", { req, res });
  const coinData = await getCoinData(user, currencyCode, coinType);
  // console.log(user);
  // console.log(coinType);
  // console.log(currencyCode);
  // console.log(coinData);

  return {
    props: {
      coinData,
    },
  };
}

export default Monitor;
