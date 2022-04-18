import React, { useState, useContext, useEffect } from "react";
import { getCookie } from "cookies-next";
import CurrencySettingsContext from "../../../context/currencySettings";
import {
  deleteFiat,
  updateFiat,
  getNotes,
  deleteAssociatedNotes,
  getCurrencyAndTheme,
} from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import eurFlag from "../../../public/eurFlagSmall.jpg";
import gbpFlag from "../../../public/gbpFlagSmall.png";
import usdFlag from "../../../public/usdFlagSmall.jpg";
import UpdateModal from "../../../components/update-modal";
import NoteCollapsible from "../../../components/note-collapsible";
import DetailPageButtons from "../../../components/detail-page-buttons";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import { getSingleFiatData } from "../../../lib/core/singleFiatData";

const Fiat = (props) => {
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { fiat, currencyAndTheme, roundTo2DP } = props;

  const [isShown, setIsShown] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    const handleNotes = async () => {
      const noteFilter = {
        user: getCookie("ue"),
        code: fiat.id,
      };
      const notes = await getNotes(noteFilter);
      setNoteList(notes);
    };
    handleNotes();
  }, [fiat]);

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

  const refreshFiatData = () => {
    Router.replace("/pocket", undefined, { scroll: false });
  };

  const handleFiatUpdate = (userAndNewAmount) => {
    const res = updateFiat(fiat.id, userAndNewAmount);
    console.log(res);
  };

  const handleUpdate = (amount) => {
    refreshFiatData();
    const userAndNewAmount = {
      amount: amount,
      user: getCookie("ue"),
    };
    handleFiatUpdate(userAndNewAmount);
  };

  const handleDeleteFiat = async () => {
    refreshFiatData();
    const res = await deleteFiat(fiat.id, getCookie("ue"));
    const res2 = await deleteAssociatedNotes(noteList);
    console.log(res);
    console.log(res2);
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
        <Image
          src={getFlag(fiat.fiatSign)}
          alt={fiat.fullFiatName}
          layout="fill"
          priority
        />
      </div>
      {isShown ? (
        <UpdateModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          name={fiat.fullFiatName}
          code={fiat.id}
          amount={fiat.amount}
          label="fiat"
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{fiat.fullFiatName}</div>
      <div className={styles.code2}>[{fiat.id}]</div>
      <div className={styles.amount}>
        {fiat.fiatSign} {roundTo2DP(fiat.amount)}
      </div>
      {fiat.fiatSign != appCurrencySign ? (
        <div className={styles.tableLayout}>
          <div className={styles.tableCellLeft}>
            {getCurrency(appCurrencySign)} value
          </div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {roundTo2DP(fiat.value)}
          </div>
        </div>
      ) : (
        <React.Fragment />
      )}
      <NoteCollapsible
        data={fiat.id}
        notes={noteList}
        notepadSettingType={"showFiatNotepad"}
        pageType={"fiat"}
        theme={currencyAndTheme.theme}
      />
      <hr className={styles.solidDivider} />
      <DetailPageButtons
        showModal={showModal}
        handleDelete={handleDeleteFiat}
        handleCancel={handleCancel}
        isShown={isShown}
        cancel={cancel}
        buttonText={"update"}
        deletionText={"delete this currency"}
        deletionSubText={" your notes will also be deleted"}
      />
    </div>
  );
};

export async function getServerSideProps({ req, res, query }) {
  const coinCode = query.id;
  const user = getCookie("ue", { req, res });
  const currencyCode = getCookie("cc", { req, res });
  const fiat = await getSingleFiatData(coinCode, user, currencyCode);
  const currencyAndTheme = await getCurrencyAndTheme(user);

  // console.log(fiat);

  return {
    props: {
      fiat,
      currencyAndTheme,
    },
  };
}

export default Fiat;
