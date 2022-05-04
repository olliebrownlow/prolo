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
import styles from "../pageStyles/portfolios.module.scss";
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

const Portfolios = (props) => {
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

  const refreshFPortfolioData = () => {
    Router.replace("/portfolios", undefined, { scroll: false });
  };

  const handleAddPortfolio = async (item) => {};

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <SettingsLink pageName={"portfolios"} />
          <div className={styles.heading}>portfolios</div>
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

export default Portfolios;
