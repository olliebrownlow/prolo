import React, { useState } from "react";
import { deleteCoin, updateCoin } from "../../../actions";
import Router from "next/router";
import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";

const Coin = (props) => {
  const {
    logo_url,
    total,
    name,
    amount,
    code,
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
    const newAmount = [
      {
        amount: amount,
      },
    ];
    setCurrentAmount(amount);
    refreshCoinData();
    // closeModal();
    handleCoinUpdate(newAmount);
  };

  const handleDeleteCoin = () => {
    const res = deleteCoin(code);
    console.log(res);
    refreshData();
  };

  const handleCancel = () => {
    Router.replace("/pocket");
  };

  return (
    <div className={styles.pageLayout}>
      <img
        className={
          styles.logo +
          " " +
          `${name === "polkadot" ? styles.withBackground : ""}`
        }
        src={logo_url}
        alt={name}
      />
      {isShown ? (
        <UpdateModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          name={name}
          code={code}
          amount={amount}
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{name}</div>
      <div className={styles.code}>[{code}]</div>
      <div className={styles.amount}>{currentAmount} coins</div>
      {currentAmount === amount ? (
        <p className={styles.total}>
          {appCurrencySign} {roundTo2DP(total)}
        </p>
      ) : (
        <p className={styles.total}>
          recalculating..
        </p>
      )}
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

Coin.getInitialProps = async ({ query }) => {
  const logo_url = query.logo_url;
  const total = query.total;
  const name = query.name;
  const amount = query.amount;
  const code = query.id;
  const currencyInUse = query.currencyInUse;

  return {
    logo_url,
    total,
    name,
    amount,
    code,
    currencyInUse,
  };
};

export default Coin;
