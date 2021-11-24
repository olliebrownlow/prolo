import React, { useState, useContext } from "react";
import CurrencySettingsContext from "../../../context/currencySettings";
import { deleteCoin, updateCoin } from "../../../actions";
import { getSingleCoinData } from "../../../lib/core/singleCoinData";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import { ArrowUp, ArrowDown, RefreshCw } from "react-feather";
import _ from "lodash";

const Coin = (props) => {
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { coin, roundTo2DP } = props;

  const [isShown, setIsShown] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(coin[0]["amount"]);

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
    const res = updateCoin(getCoinProp("id"), newAmount);
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
    const res = deleteCoin(getCoinProp("id"));
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
    if (getCoinProp("maxSupply") == "no maximum") {
      return "n/a";
    }

    return (
      roundTo2DP((getCoinProp("supply") / getCoinProp("maxSupply")) * 100) + "%"
    );
  };

  const roundTo3DP = (unrounded) => {
    return (Math.round(unrounded * 1000) / 1000).toFixed(3);
  };

  const getCoinProp = (propName) => {
    return coin[0][propName];
  };

  return (
    <div className={styles.pageLayout}>
      <div
        className={
          styles.logo +
          " " +
          `${getCoinProp("name") === "polkadot" ? styles.withBackground : ""}`
        }
      >
        <Image
          src={getCoinProp("logo_url")}
          alt={getCoinProp("name")}
          layout="fill"
          priority
        />
      </div>
      {isShown ? (
        <UpdateModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          name={getCoinProp("name")}
          code={getCoinProp("id")}
          amount={getCoinProp("amount")}
          label="coin"
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{getCoinProp("name")}</div>
      <div className={styles.code2}>[{getCoinProp("id")}]</div>
      <div className={styles.code2}>{currentAmount} coins</div>
      {currentAmount === getCoinProp("amount") ? (
        <Link
          href={{
            pathname: "/coins/[id]",
            query: { id: coin[0]["id"] },
          }}
        >
          <div className={styles.amount}>
            {appCurrencySign}
            {roundTo2DP(getCoinProp("total"))} <RefreshCw />
          </div>
        </Link>
      ) : (
        <div className={styles.amount}>recalculating..</div>
      )}
      <table className={styles.tableLayout}>
        <thead>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>current price</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {roundTo3DP(getCoinProp("price"))}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>price at 1hr</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {roundTo3DP(
                getCoinProp("price") * 1 - getCoinProp("hPriceChange") * 1
              )}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>price change</td>
            <td
              className={
                styles.tableCellRight +
                " " +
                `${getCoinProp("hPriceChange") < 0 ? styles.red : styles.green}`
              }
            >
              {appCurrencySign}
              {roundTo3DP(getCoinProp("hPriceChange"))}
              {getCoinProp("hPriceChange") < 0 ? <ArrowDown /> : <ArrowUp />}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>price change %</td>
            <td
              className={
                styles.tableCellRight +
                " " +
                `${
                  getCoinProp("hPriceChangePct") < 0 ? styles.red : styles.green
                }`
              }
            >
              {roundTo2DP(getCoinProp("hPriceChangePct"))}%
              {getCoinProp("hPriceChangePct") < 0 ? <ArrowDown /> : <ArrowUp />}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>all-time high</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {roundTo3DP(getCoinProp("high"))}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>high date</td>
            <td className={styles.tableCellRight}>
              {formatDate(getCoinProp("highDate"))}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>market capitalisation</td>
            <td className={styles.tableCellRight}>
              {appCurrencySign}
              {commaFormat(getCoinProp("marketCap"))}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>
              rank by market capitalisation
            </td>
            <td className={styles.tableCellRight}>{getCoinProp("rank")}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>coins in circulation</td>
            <td className={styles.tableCellRight}>
              {commaFormat(getCoinProp("supply"))}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>minting limit</td>
            <td className={styles.tableCellRight}>
              {commaFormat(getCoinProp("maxSupply"))}
            </td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>current circulation %</td>
            <td className={styles.tableCellRight}>{circulationPercentage()}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>first trade</td>
            <td className={styles.tableCellRight}>
              {formatDate(getCoinProp("firstTrade"))}
            </td>
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
  const code = query.id;
  const appCurrencySign = query.appCurrencySign;
  const coin = await getSingleCoinData(code);

  // console.log(coin);

  return {
    props: {
      coin,
    },
  };
}

export default Coin;
