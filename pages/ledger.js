import React, { useContext, useState } from "react";
import Router from "next/router";
import { getCookie } from "cookies-next";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import SettingsLink from "../components/settings-link";
import AddButton from "../components/add-button";
import FundingList from "../components/funding-list";
import NotLoggedIn from "../components/not-logged-in";
import styles from "../pageStyles/ledger.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";
import { getProlo } from "../lib/core/profitLossCalc";
import {
  getFundingData,
  getHistoricalData,
  addInvestmentItem,
} from "../actions";
import { RefreshCw } from "react-feather";
import InvestmentModal from "../components/investment-modal";
import _ from "lodash";

const Ledger = (props) => {
  const {
    roundTo2DP,
    balances,
    investmentItems,
    userNumber,
    portfolioNumber,
  } = props;

  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyName } = useContext(
    CurrencySettingsContext
  );
  const [isShown, setIsShown] = useState(false);
  const [anim, setAnim] = useState(0);

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
    Router.replace("/ledger", undefined, { scroll: false });
  };

  const handleAddInvestmentItem = async (item) => {
    const historicalData = await getHistoricalData(
      item.currencyCode,
      item.date
    );

    // add remaining properties and format others
    item.userNumber = parseInt(userNumber);
    item.portfolioNumber = parseInt(portfolioNumber);
    item.euros = historicalData.response.rates.EUR * item.amount;
    item.britishSterling = historicalData.response.rates.GBP * item.amount;
    item.americanDollars = historicalData.response.rates.USD * item.amount;
    item.currencyCode = item.currencyCode.toLowerCase();
    item.sortingNumber = parseInt(_.words(item.date).join(""));
    item.date = _.words(item.date.substring(2)).reverse().join("-");

    const res = await addInvestmentItem(item);
    console.log(res);
    if (res !== "cannot add future-dated funding items") {
      setTimeout(closeModal(), 1000);
      refreshFundingHistoryData();
    }
  };  

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <SettingsLink pageName={"ledger"} />
          <div className={styles.heading}>profit/loss</div>
          <Link href="/ledger" scroll={false}>
            <div className={styles.prolo} onClick={() => setAnim(1)}>
              {appCurrencySign}
              {roundTo2DP(
                getProlo(appCurrencyName, investmentItems, balances.balance)
              )}{" "}
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
            {roundTo2DP(balances.balance)}
          </div>
          <hr className={styles.solidDivider} />
          <div className={styles.heading}>funding</div>
          <div className={styles.balance}>
            {appCurrencySign}
            {roundTo2DP(
              balances.balance -
                getProlo(appCurrencyName, investmentItems, balances.balance)
            )}
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
            investmentItems={investmentItems}
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
  const balances = await calculateBalance(coinData, fiatData);
  const investmentItems = await getFundingData({
    userNumber: userNumber,
    portfolioNumber: portfolioNumber,
  });
  // console.log(userNumber);
  // console.log(portfolioNumber);
  // console.log(coinType);
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(balances);
  // console.log(investmentItems);

  return {
    props: {
      balances,
      investmentItems,
      userNumber: userNumber,
      portfolioNumber: portfolioNumber,
    },
  };
}

export default Ledger;
