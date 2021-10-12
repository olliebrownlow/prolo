import React, { useState } from "react";
import { deleteFiat, updateFiat } from "../../../actions";
import Router from "next/router";
import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";

const Fiat = (props) => {
  const {
    total,
    name,
    amount,
    code,
    fiatSign,
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

  const refreshFiatData = () => {
    Router.replace("/pocket");
  };

  const handleFiatUpdate = (newAmount) => {
    const res = updateFiat(code, newAmount);
    console.log(res);
  };

  const handleUpdate = (amount) => {
    const newAmount = [
      {
        amount: amount,
      },
    ];
    setCurrentAmount(amount);
    refreshFiatData();
    // closeModal();
    handleFiatUpdate(newAmount);
  };

  const handleDeleteFiat = async () => {
    const res = await deleteFiat(code);
    console.log(res);
    refreshData();
  };

  const handleCancel = () => {
    Router.replace("/pocket");
  };

  return (
    <div className={styles.pageLayout}>
      <img
        className={styles.logo}
        src={`../${code.toLowerCase()}Flag.jpg`}
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
          label="fiat"
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{name}</div>
      <div className={styles.code}>[{code}]</div>
      <div className={styles.amount}>
        {fiatSign} {roundTo2DP(amount)}
      </div>
      <p className={styles.total}>
        {appCurrencySign} {roundTo2DP(total)}
      </p>
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
          onClick={() => handleDeleteFiat()}
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

Fiat.getInitialProps = async ({ query }) => {
  const total = query.total;
  const name = query.name;
  const amount = query.amount;
  const code = query.id;
  const fiatSign = query.fiatSign;
  const appCurrencySign = query.appCurrencySign;

  return {
    total,
    name,
    amount,
    code,
    fiatSign,
    appCurrencySign,
  };
};

export default Fiat;
