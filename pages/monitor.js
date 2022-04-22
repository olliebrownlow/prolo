import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/UserContext";
import { getCoinData } from "../lib/core/coinData";
import { getCookie } from "cookies-next";
import CurrencySettingsContext from "../context/currencySettings";
import Loading from "../components/loading";
import CoinMonitoredList from "../components/coin-monitored-list";
import Modal from "../components/modal";
import CustomiseMonitor from "../components/customise-monitor";
import Link from "next/link";
import { RefreshCw } from "react-feather";
import NotLoggedIn from "../components/not-logged-in";
import SettingsLink from "../components/settings-link";
import coinSelectOptions from "../config/coinSelectOptions";
import styles from "../pageStyles/monitor.module.scss";
import {
  updateCustomisableMonitorSettings,
  getCustomisableMonitorSettings,
} from "../actions";

const Monitor = (props) => {
  const [user] = useContext(UserContext);
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { coinData, settings, userNumber } = props;
  const [isCoinOptionsExhausted, setIsCoinOptionsExhausted] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(settings);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    if (coinSelectOptions.length === coinData.length) {
      setIsCoinOptionsExhausted(true);
    }
  }, [coinData]);

  const handleMonitorDisplaySettingsUpdate = async (newSettings) => {
    const settingsAndUserNumber = {
      userNumber: userNumber,
      newSettings: newSettings,
    };
    setCurrentSettings(newSettings);
    const res = await updateCustomisableMonitorSettings(settingsAndUserNumber);
    console.log(res);
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <SettingsLink pageName={"monitor"} />
          <Link href="/monitor" scroll={false}>
            <div className={styles.heading} onClick={() => setAnim(1)}>
              coins{" "}
              <RefreshCw
                className={styles.refresh}
                onClick={() => setAnim(1)}
                onAnimationEnd={() => setAnim(0)}
                anim={anim}
              />
            </div>
          </Link>
          <div className={styles.actionButtons}>
            <Modal
              buttonText={"add coin"}
              labelName={"coin"}
              data={coinData}
              dataOptionsExhausted={isCoinOptionsExhausted}
              userEmail={user.email}
              type={"monitoring"}
            />
            <CustomiseMonitor
              buttonText={"customise"}
              currentSettings={currentSettings}
              handleFormSubmit={handleMonitorDisplaySettingsUpdate}
            />
          </div>
          <CoinMonitoredList
            coinData={coinData}
            currentSettings={currentSettings}
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
  const user = getCookie("ue", { req, res });
  const userNumber = getCookie("un", { req, res });
  const coinType = getCookie("ct", { req, res });
  const currencyCode = getCookie("cc", { req, res });
  const coinData = await getCoinData(user, currencyCode, coinType);
  const settings = await getCustomisableMonitorSettings(
    userNumber,
    "orderBySettings"
  );
  // console.log(user);
  // console.log(coinType);
  // console.log(currencyCode);
  // console.log(coinData);

  return {
    props: {
      coinData,
      settings,
      userNumber: userNumber,
    },
  };
}

export default Monitor;
