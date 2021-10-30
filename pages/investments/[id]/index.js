import React, { useState } from "react";
import { deleteInvestmentItem } from "../../../actions";
import Router from "next/router";
// import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";

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

  // const [isShown, setIsShown] = useState(false);
  // const [currentAmount, setCurrentAmount] = useState(amount);

  // const showModal = () => {
  //   setIsShown(true);
  // };

  // const closeModal = () => {
  //   setIsShown(false);
  // };

  // // close modal from window surrounding the modal itself
  // const windowOnClick = (event) => {
  //   if (event.target === event.currentTarget) {
  //     setIsShown(false);
  //   }
  // };

  // const refreshData = () => {
  //   window.location = "/ledger";
  // };

  const refreshInvestmentData = () => {
    Router.replace("/ledger");
  };

  // const handleInvestmentUpdate = (newAmount) => {
  //   const res = updateCoin(code, newAmount);
  //   console.log(res);
  // };

  // const handleUpdate = (amount) => {
  //   const newAmount = [
  //     {
  //       amount: amount,
  //     },
  //   ];
  //   setCurrentAmount(amount);
  //   refreshInvestmentData();
  //   // closeModal();
  //   handleInvestmentUpdate(newAmount);
  // };

  const handleDelete = () => {
    const res = deleteInvestmentItem(id);
    console.log(res);
    refreshInvestmentData();
  };

  const handleCancel = () => {
    Router.replace("/ledger");
  };

  return (
    <div className={styles.pageLayout}>
      <img
        className={styles.logo}
        src={`../${currencyCode.toLowerCase()}Flag.jpg`}
        alt={currencyName}
      />
      {/* {isShown ? (
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
      )} */}
      <div className={styles.name}>{currencyName}</div>
      <div className={styles.code2}>[{currencyCode}]</div>
      <div className={styles.amount}>
        {currencySign}
        {roundTo2DP(amount)}
      </div>
      <table className={styles.tableLayout}>
        <thead>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>type</td>
            <td className={styles.tableCellRight}>{type}</td>
          </tr>
          <tr className={styles.tableItem}>
            <td className={styles.tableCellLeft}>date</td>
            <td className={styles.tableCellRight}>{date}</td>
          </tr>
          {roundTo2DP(euros) === roundTo2DP(amount) ? (
            <React.Fragment />
          ) : (
            <tr className={styles.tableItem}>
              <td className={styles.tableCellLeft}>euro value</td>
              <td className={styles.tableCellRight}>€{roundTo2DP(euros)}</td>
            </tr>
          )}
          {roundTo2DP(britishSterling) === roundTo2DP(amount) ? (
            <React.Fragment />
          ) : (
            <tr className={styles.tableItem}>
              <td className={styles.tableCellLeft}>sterling value</td>
              <td className={styles.tableCellRight}>
                £{roundTo2DP(britishSterling)}
              </td>
            </tr>
          )}
          {roundTo2DP(americanDollars) === roundTo2DP(amount) ? (
            <React.Fragment />
          ) : (
            <tr className={styles.tableItem}>
              <td className={styles.tableCellLeft}>dollar value</td>
              <td className={styles.tableCellRight}>
                ${roundTo2DP(americanDollars)}
              </td>
            </tr>
          )}
        </thead>
      </table>
      <hr className={styles.solidDivider} />
      <div className={styles.buttons}>
        <button
          className={styles.updateButton}
          // onClick={() => showModal()}
          role="button"
        >
          correct
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => handleDelete()}
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

Investment.getInitialProps = async ({ query }) => {
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
  };
};

export default Investment;
