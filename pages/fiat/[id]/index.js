import React, { useState, useContext } from "react";
import { UserContext } from "../../../lib/UserContext";
import { deleteFiat, updateFiat } from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import eurFlag from "../../../public/eurFlagSmall.jpg";
import gbpFlag from "../../../public/gbpFlagSmall.png";
import usdFlag from "../../../public/usdFlagSmall.jpg";
import UpdateModal from "../../../components/update-modal";
import NoteCollapsible from "../../../components/note-collapsible";
import DetailPageButtons from "../../../components/detail-page-buttons";
import styles from "../../../pageStyles/dynamicPage.module.scss";

const Fiat = (props) => {
  const [user] = useContext(UserContext);
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
  const [deleted, setDeleted] = useState(false);
  const [cancel, setCancel] = useState(false);

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
    Router.back();
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
          isShown={isShown}
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
      <NoteCollapsible user={user} data={code} />
      <hr className={styles.solidDivider} />
      <DetailPageButtons
        showModal={showModal}
        handleDelete={handleDeleteFiat}
        handleCancel={handleCancel}
        isShown={isShown}
        deleted={deleted}
        cancel={cancel}
        buttonText={"update"}
      />
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
