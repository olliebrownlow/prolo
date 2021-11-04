import React, { useState } from "react";
import { deleteFiat, updateFiat } from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import eurFlag from "../../../public/eurFlag.jpg";
import gbpFlag from "../../../public/gbpFlag.jpg";
import usdFlag from "../../../public/usdFlag.jpg";
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
    refreshFiatData();
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

  const getFlag = (sign) => {
    if (sign === "£") {
      return gbpFlag;
    } else if (sign === "$") {
      return usdFlag;
    } else {
      return eurFlag;
    }
  };

  const getCurrency = (sign) => {
    if (sign === "£") {
      return "sterling";
    } else if (sign === "$") {
      return "dollar";
    } else {
      return "euro";
    }
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.flagLogo}>
        <Image
          src={getFlag(fiatSign)}
          alt={name}
          layout="responsive"
          width={60}
          height={40}
        />
      </div>
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
      <div className={styles.code2}>[{code}]</div>
      <div className={styles.amount}>
        {fiatSign} {roundTo2DP(amount)}
      </div>
      {fiatSign != appCurrencySign ? (
        <table className={styles.tableLayout}>
          <thead>
            <tr className={styles.tableItem}>
              <td className={styles.tableCellLeft}>
                {getCurrency(appCurrencySign)} value
              </td>
              <td className={styles.tableCellRight}>
                {appCurrencySign}
                {roundTo2DP(total)}
              </td>
            </tr>
          </thead>
        </table>
      ) : (
        <React.Fragment />
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
