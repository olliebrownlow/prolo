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
  const { roundTo2DP, balances, investmentItems } = props;

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
    refreshFundingHistoryData();

    const historicalData = await getHistoricalData(
      item.currencyCode,
      item.date
    );

    // add remaining properties and format others
    item.user = user.email;
    item.euros = historicalData.response.rates.EUR * item.amount;
    item.britishSterling = historicalData.response.rates.GBP * item.amount;
    item.americanDollars = historicalData.response.rates.USD * item.amount;
    item.currencyCode = item.currencyCode.toLowerCase();
    item.sortingNumber = Number(_.words(item.date).join(""));
    item.date = _.words(item.date.substring(2)).reverse().join("-");

    const res = await addInvestmentItem(item);
    console.log(res);
    setTimeout(closeModal(), 1000);
  };

  const prolo = () => {
    const propertyName = _.camelCase(appCurrencyName);
    const valuesArray = [];
    investmentItems.map((investment) => {
      const positiveValue = parseFloat(investment[propertyName]);
      if (investment.type === "withdrawal") {
        const negativeValue = positiveValue * -1;
        valuesArray.push(negativeValue);
      } else {
        valuesArray.push(positiveValue);
      }
    });
    // reduce causes error when array is empty
    if (valuesArray.length) {
      const unroundedInvestmentValue = valuesArray.reduce(
        (accumulator, current) => accumulator + current
      );
      return balances.balance - unroundedInvestmentValue;
    } else {
      return balances.balance;
    }
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <>
            <SettingsLink />
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
              {roundTo2DP(balances.balance)}
            </div>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>funding</div>
            <div className={styles.balance}>
              {appCurrencySign}
              {roundTo2DP(balances.balance - prolo())}
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
        )
      )}
    </>
  );
};

export async function getServerSideProps({ req, res }) {
  const user = getCookie("ue", { req, res });
  const currencyCode = getCookie("cc", { req, res });
  const coinData = await getCoinData(user, currencyCode);
  const fiatData = await getFiatData(user, currencyCode);
  const balances = await calculateBalance(coinData, fiatData);
  const investmentItems = await getFundingData({ user: user });
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(balances);
  // console.log(investmentItems);

  return {
    props: {
      balances,
      investmentItems,
    },
  };
}

export default Ledger;
