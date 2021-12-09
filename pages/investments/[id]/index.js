import React, { useState } from "react";
import {
  deleteInvestmentItem,
  getHistoricalData,
  updateInvestmentItem,
} from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import eurFlag from "../../../public/eurFlagSmall.jpg";
import gbpFlag from "../../../public/gbpFlagSmall.png";
import usdFlag from "../../../public/usdFlagSmall.jpg";
import CorrectModal from "../../../components/correct-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import _ from "lodash";
import { motion } from "framer-motion";

const Investment = (props) => {
  const {
    id,
    currencyName,
    currencyCode,
    currencySign,
    type,
    amount,
    date,
    euros,
    britishSterling,
    americanDollars,
    appCurrencySign,
    roundTo2DP,
  } = props;

  const [isShown, setIsShown] = useState(false);
  const [update, setUpdate] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [cancel, setCancel] = useState(false);

  const showModal = () => {
    setUpdate(true);
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

  const refreshInvestmentData = () => {
    Router.replace("/ledger");
  };

  const handleUpdate = async (correctedItem) => {
    refreshInvestmentData();

    if (correctedItem.date.length === 8) {
      const array = correctedItem.date.split("-");
      array.reverse();
      array[0] = "2021";
      correctedItem.date = array.join("-");
    }
    const historicalData = await getHistoricalData(
      correctedItem.currencyCode.toUpperCase(),
      correctedItem.date
    );

    // add remaining properties and format others
    correctedItem.euros =
      historicalData.response.rates.EUR * correctedItem.amount;
    correctedItem.britishSterling =
      historicalData.response.rates.GBP * correctedItem.amount;
    correctedItem.americanDollars =
      historicalData.response.rates.USD * correctedItem.amount;
    correctedItem.date = _.words(correctedItem.date.substring(2))
      .reverse()
      .join("-");

    const res = await updateInvestmentItem(correctedItem.id, correctedItem);
    console.log(res);
  };

  const handleDelete = () => {
    setDeleted(true);
    refreshInvestmentData();
    const res = deleteInvestmentItem(id);
    console.log(res);
  };

  const handleCancel = () => {
    setCancel(true);
    Router.replace("/ledger");
  };

  const getFlag = (sign) => {
    if (sign === "£") {
      return gbpFlag;
    } else if (sign === "$") {
      return usdFlag;
    } else {
      return eurFlag;
    }
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.flagLogo}>
        <Image
          src={getFlag(currencySign)}
          alt={currencyName}
          layout="fill"
          priority
        />
      </div>
      {isShown ? (
        <CorrectModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          id={id}
          currencyName={currencyName}
          currencyCode={currencyCode}
          currencySign={currencySign}
          amount={amount}
          type={type}
          date={date}
          label="funding item"
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{currencyName}</div>
      <div className={styles.code2}>[{currencyCode}]</div>
      <div className={styles.amount}>
        {currencySign}
        {roundTo2DP(amount)}
      </div>

      <div className={styles.analysisLayout}>
        <div className={styles.tableCellLeft}>type</div>
        <div className={styles.tableCellRight}>{type}</div>
        <div className={styles.tableCellLeft}>date</div>
        <div className={styles.tableCellRight}>{date}</div>
      </div>

      <div className={styles.analysisLayout}>
        {roundTo2DP(euros) === roundTo2DP(amount) ? (
          <React.Fragment />
        ) : (
          <>
            <div className={styles.tableCellLeft}>euro value</div>
            <div className={styles.tableCellRight}>€{roundTo2DP(euros)}</div>
          </>
        )}
        {roundTo2DP(britishSterling) === roundTo2DP(amount) ? (
          <React.Fragment />
        ) : (
          <>
            <div className={styles.tableCellLeft}>sterling value</div>
            <div className={styles.tableCellRight}>
              £{roundTo2DP(britishSterling)}
            </div>
          </>
        )}
        {roundTo2DP(americanDollars) === roundTo2DP(amount) ? (
          <React.Fragment />
        ) : (
          <>
            <div className={styles.tableCellLeft}>dollar value</div>
            <div className={styles.tableCellRight}>
              ${roundTo2DP(americanDollars)}
            </div>
          </>
        )}
      </div>
      <hr className={styles.solidDivider} />
      <div className={styles.buttons}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={update ? { scale: [1, 0.5, 1] } : {}}
          className={styles.updateButton}
          onClick={() => showModal()}
          role="button"
        >
          correct
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={deleted ? { scale: [1, 0.5, 1] } : {}}
          className={styles.deleteButton}
          onClick={() => handleDelete()}
          role="button"
        >
          delete
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={cancel ? { scale: [1, 0.5, 1] } : {}}
          className={styles.cancelButton}
          onClick={() => handleCancel()}
          role="button"
        >
          cancel
        </motion.button>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id;
  const currencyName = query.currencyName;
  const currencyCode = query.currencyCode;
  const currencySign = query.currencySign;
  const type = query.type;
  const amount = query.amount;
  const date = query.date;
  const euros = query.euros;
  const britishSterling = query.britishSterling;
  const americanDollars = query.americanDollars;
  const appCurrencySign = query.appCurrencySign;

  return {
    props: {
      id,
      currencyName,
      currencyCode,
      currencySign,
      type,
      amount,
      date,
      euros,
      britishSterling,
      americanDollars,
      appCurrencySign,
    },
  };
}

export default Investment;
