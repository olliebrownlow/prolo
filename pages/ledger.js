import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import AddButton from "../components/add-button";
import FundingList from "../components/funding-list";
import styles from "../pageStyles/ledger.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";
import {
  getFundingData,
  getHistoricalData,
  addInvestmentItem,
} from "../actions";
import { RefreshCw } from "react-feather";
import InvestmentModal from "../components/investment-modal";
import _ from "lodash";

const Ledger = (props) => {
  const { roundTo2DP, balance, fundingHistoryData } = props;

  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyCode, appCurrencyName } = useContext(
    CurrencySettingsContext
  );
  const [isShown, setIsShown] = useState(false);
  const [currencyFlag, setCurrencyFlag] = useState(eurFlag);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    if (appCurrencyCode === "gbp") {
      setCurrencyFlag(gbpFlag);
    } else if (appCurrencyCode != "eur") {
      setCurrencyFlag(usdFlag);
    }
  }, [appCurrencyCode]);

  const showModal = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsShown(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(false);
    }
  };

  const refreshFundingHistoryData = () => {
    Router.replace("/ledger");
  };

  const handleAddInvestmentItem = async (item) => {
    refreshFundingHistoryData();

    const historicalData = await getHistoricalData(
      item.currencyCode,
      item.date
    );

    // add remaining properties and format others
    item.euros = historicalData.response.rates.EUR * item.amount;
    item.britishSterling = historicalData.response.rates.GBP * item.amount;
    item.americanDollars = historicalData.response.rates.USD * item.amount;
    item.currencyCode = item.currencyCode.toLowerCase();
    item.date = _.words(item.date.substring(2)).reverse().join("-");

    const res = await addInvestmentItem(item);
    console.log(res);
    setTimeout(closeModal(), 1000)
  };

  const prolo = () => {
    const propertyName = _.camelCase(appCurrencyName);
    const valuesArray = [];
    fundingHistoryData.map((investment) => {
      const positiveValue = parseFloat(investment[propertyName]);
      if (investment.type === "withdrawal") {
        const negativeValue = positiveValue * -1;
        valuesArray.push(negativeValue);
      } else {
        valuesArray.push(positiveValue);
      }
    });
    const unroundedInvestmentValue = valuesArray.reduce(
      (accumulator, current) => accumulator + current
    );
    return balance - unroundedInvestmentValue;
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <>
            <Link href="/settings">
              <div className={styles.currencyImg}>
                <Image
                  src={currencyFlag}
                  alt={appCurrencyCode}
                  layout="intrinsic"
                  priority
                />
              </div>
            </Link>
            <div className={styles.heading}>profit/loss</div>
            <Link href="/ledger" scroll={false}>
              <div className={styles.prolo} onClick={() => setAnim(1)}>
                {appCurrencySign}
                {roundTo2DP(prolo())}{" "}
                <RefreshCw
                  className={styles.refresh}
                  onClick={() => setAnim(1)}
                  onAnimationEnd={() => setAnim(0)}
                  anim={anim}
                />
              </div>
            </Link>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>balance</div>
            <div className={styles.balance}>
              {appCurrencySign}
              {roundTo2DP(balance)}
            </div>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>funding</div>
            <div className={styles.balance}>
              {appCurrencySign}
              {roundTo2DP(balance - prolo())}
            </div>
            <div className={styles.subheading}>breakdown</div>
            <AddButton
              buttonText={"add item"}
              showModal={showModal}
              showLogo={true}
              isShown={isShown}
            />
            {isShown ? (
              <InvestmentModal
                closeModal={closeModal}
                windowOnClick={windowOnClick}
                handleFormSubmit={handleAddInvestmentItem}
                isShown={isShown}
              />
            ) : (
              <React.Fragment />
            )}
            <FundingList
              roundTo2DP={roundTo2DP}
              fundingHistoryData={fundingHistoryData}
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
  const balance = await calculateBalance(coinData, fiatData);
  const fundingHistoryData = await getFundingData();
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(balance)

  return {
    props: {
      balance,
      fundingHistoryData,
    },
  };
}

export default Ledger;
