import { useContext, useState, useEffect } from "react";
import { UserContext } from "../lib/UserContext";
import CurrencySettingsContext from "../context/currencySettings";
import Loading from "../components/loading";
import CoinList from "../components/coin-list";
import FiatList from "../components/fiat-list";
import Modal from "../components/modal";
import PocketBalance from "../components/pocket-balance";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlag.jpg";
import gbpFlag from "../public/gbpFlag.jpg";
import usdFlag from "../public/usdFlag.jpg";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import styles from "../pageStyles/pocket.module.scss";

const Pocket = (props) => {
  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyCode } = useContext(
    CurrencySettingsContext
  );
  const { coinData, fiatData, roundTo2DP } = props;
  const [currencyFlag, setCurrencyFlag] = useState(eurFlag);

  useEffect(() => {
    if (appCurrencyCode === "gbp") {
      setCurrencyFlag(gbpFlag);
    } else if (appCurrencyCode != "eur") {
      setCurrencyFlag(usdFlag)
    }
  }, [appCurrencyCode]);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.pocketLayout}>
            <Link href="/settings">
              <div className={styles.currencyImg}>
                <Image
                  src={currencyFlag}
                  alt={appCurrencyCode}
                  layout="responsive"
                  width={48}
                  height={32}
                />
              </div>
            </Link>
            <div className={styles.heading}>balance</div>
            <PocketBalance
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              fiatData={fiatData}
              appCurrencySign={appCurrencySign}
            />
            <div className={styles.heading}>coin holdings</div>
            <Modal buttonText={"add coin"} labelName={"coin"} data={coinData} />
            <CoinList
              roundTo2DP={roundTo2DP}
              coinData={coinData}
              appCurrencySign={appCurrencySign}
            />
            <div className={styles.heading}>fiat holdings</div>
            <Modal buttonText={"add fiat"} labelName={"fiat"} data={fiatData} />
            <FiatList
              roundTo2DP={roundTo2DP}
              fiatData={fiatData}
              appCurrencySign={appCurrencySign}
            />
          </div>
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
