import React, { useState } from "react";
import { deleteCoin, updateCoin } from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import { ArrowUp, ArrowDown } from "react-feather";
import _ from "lodash";

const Coin = (props) => {
  const {
    logo_url,
    total,
    name,
    amount,
    code,
    price,
    hPriceChange,
    hPriceChangePct,
    high,
    highDate,
    rank,
    firstTrade,
    marketCap,
    supply,
    maxSupply,
    appCurrencySign,
    roundTo2DP,
  } = props;

  const [isShown, setIsShown] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(amount);

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

  const refreshData = () => {
    window.location = "/pocket";
  };

  const refreshCoinData = () => {
    Router.replace("/pocket");
  };

  const handleCoinUpdate = (newAmount) => {
    const res = updateCoin(code, newAmount);
    console.log(res);
  };

  const handleUpdate = (amount) => {
    refreshCoinData();
    const newAmount = [
      {
        amount: amount,
      },
    ];
    setCurrentAmount(amount);
    // closeModal();
    handleCoinUpdate(newAmount);
  };

  const handleDeleteCoin = () => {
    refreshData();
    const res = deleteCoin(code);
    console.log(res);
  };

  const handleCancel = () => {
    Router.replace("/pocket");
  };

  const formatDate = (date) => {
    return _.words(date.substring(2, 10)).reverse().join("-");
  };

  const commaFormat = (longNumber) => {
    if (longNumber == "no maximum") {
      return longNumber;
    }

    return parseFloat(longNumber).toLocaleString("en");
  };

  const circulationPercentage = () => {
    if (maxSupply == "no maximum") {
      return "n/a";
    }

    return roundTo2DP((supply / maxSupply) * 100) + "%";
  };

  const roundTo3DP = (unrounded) => {
    return (Math.round(unrounded * 1000) / 1000).toFixed(3);
  };

  return (
    <div className={styles.pageLayout}>
      <div
        className={
          styles.logo +
          " " +
          `${name === "polkadot" ? styles.withBackground : ""}`
        }
      >
        <Image src={logo_url} alt={name} layout="fill" priority />
      </div>
      {isShown ? (
        <UpdateModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          name={name}
          code={code}
          amount={amount}
          label="coin"
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{name}</div>
      <div className={styles.code2}>[{code}]</div>
      {currentAmount === amount ? (
        <div className={styles.amount}>
          {appCurrencySign}
          {roundTo2DP(total)}
        </div>
      ) : (
        <div className={styles.amount}>recalculating..</div>
      )}
      <table className={styles.tableLayout}>
        <thead>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>coins</td>
            <td className={styles.tableCellRight}>{currentAmount}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>current price</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {roundTo2DP(price)}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>1 hour price change</td>
            <td
              className={
                styles.tableCellRight +
                " " +
                `${hPriceChange < 0 ? styles.red : styles.green}`
              }
            >
              {appCurrencySign}
              {roundTo3DP(hPriceChange)}
              {hPriceChange < 0 ? <ArrowDown /> : <ArrowUp />}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>1 hour price change %</td>
            <td
              className={
                styles.tableCellRight +
                " " +
                `${hPriceChangePct < 0 ? styles.red : styles.green}`
              }
            >
              {roundTo2DP(hPriceChangePct)}%
              {hPriceChangePct < 0 ? <ArrowDown /> : <ArrowUp />}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>all-time high</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {roundTo2DP(high)}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>high date</td>
            <td className={styles.tableCellRight}>{formatDate(highDate)}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>market capitalisation</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {commaFormat(marketCap)}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>
              rank by market capitalisation
            </td>
            <td className={styles.tableCellRight}>{rank}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>coins in circulation</td>
            <td className={styles.tableCellRight}>{commaFormat(supply)}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>minting limit</td>
            <td className={styles.tableCellRight}>{commaFormat(maxSupply)}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>current circulation %</td>
            <td className={styles.tableCellRight}>{circulationPercentage()}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>first trade</td>
            <td className={styles.tableCellRight}>{formatDate(firstTrade)}</td>
          </tr>
        </thead>
      </table>
      <hr className={styles.solidDivider} />
      <div className={styles.buttons}>
        <button
          className={styles.updateButton}
          onClick={() => showModal()}
          role="button"
        >
          update
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteCoin()}
          role="button"
        >
          delete
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => handleCancel()}
          role="button"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const logo_url = query.logo_url;
  const total = query.total;
  const name = query.name;
  const amount = query.amount;
  const code = query.id;
  const appCurrencySign = query.appCurrencySign;
  const price = query.price;
  const hPriceChange = query.hPriceChange;
  const hPriceChangePct = query.hPriceChangePct;
  const high = query.high;
  const rank = query.rank;
  const firstTrade = query.firstTrade;
  const highDate = query.highDate;
  const marketCap = query.marketCap;
  const supply = query.supply;
  const maxSupply = query.maxSupply;

  return {
    props: {
      logo_url,
      total,
      name,
      amount,
      code,
      appCurrencySign,
      price,
      hPriceChange,
      hPriceChangePct,
      high,
      highDate,
      rank,
      firstTrade,
      marketCap,
      supply,
      maxSupply,
    },
  };
}

export default Coin;
