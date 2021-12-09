import React, { useState } from "react";
import { deleteFiat, updateFiat } from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import eurFlag from "../../../public/eurFlagSmall.jpg";
import gbpFlag from "../../../public/gbpFlagSmall.png";
import usdFlag from "../../../public/usdFlagSmall.jpg";
import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import { motion } from "framer-motion";

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
    refreshFiatData();
    const newAmount = [
      {
        amount: amount,
      },
    ];
    handleFiatUpdate(newAmount);
  };

  const handleDeleteFiat = async () => {
    setDeleted(true);
    refreshData();
    const res = await deleteFiat(code);
    console.log(res);
  };

  const handleCancel = () => {
    setCancel(true);
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
        <Image src={getFlag(fiatSign)} alt={name} layout="fill" priority />
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
        <div className={styles.tableLayout}>
          <div className={styles.tableCellLeft}>
            {getCurrency(appCurrencySign)} value
          </div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {roundTo2DP(total)}
          </div>
        </div>
      ) : (
        <React.Fragment />
      )}
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
          update
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={deleted ? { scale: [1, 0.5, 1] } : {}}
          className={styles.deleteButton}
          onClick={() => handleDeleteFiat()}
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
  const total = query.total;
  const name = query.name;
  const amount = query.amount;
  const code = query.id;
  const fiatSign = query.fiatSign;
  const appCurrencySign = query.appCurrencySign;

  return {
    props: {
      total,
      name,
      amount,
      code,
      fiatSign,
      appCurrencySign,
    },
  };
}

export default Fiat;
