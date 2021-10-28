import React, { useContext, useState } from "react";
import Router from "next/router";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
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
    refreshFundingHistoryData();
    console.log(res);
    closeModal();
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
          <div className={styles.ledgerLayout}>
            <Link href="/settings">
              <img
                className={styles.currencyImg}
                src={`./${appCurrencyCode}Flag.jpg`}
                alt={appCurrencyCode}
              />
            </Link>
            <div className={styles.heading}>profit/loss</div>
            <Link href="/ledger">
              <div className={styles.prolo}>
                {appCurrencySign}
                {roundTo2DP(prolo())} <RefreshCw />
              </div>
            </Link>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>balance</div>
            <div className={styles.balance}>
              {appCurrencySign}
              {roundTo2DP(balance)}
            </div>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>funding history</div>
            <AddButton
              buttonText={"add item"}
              showModal={showModal}
              showLogo={true}
            />
            {isShown ? (
              <InvestmentModal
                closeModal={closeModal}
                windowOnClick={windowOnClick}
                handleFormSubmit={handleAddInvestmentItem}
              />
            ) : (
              <React.Fragment />
            )}
            <FundingList
              roundTo2DP={roundTo2DP}
              fundingHistoryData={fundingHistoryData}
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
