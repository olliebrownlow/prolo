import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../lib/UserContext";
import {
  deleteFiat,
  updateFiat,
  getNotes,
  deleteAssociatedNotes,
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
  const [user] = useContext(UserContext);
  const { fiat, appCurrencySign, roundTo2DP } = props;

  const [isShown, setIsShown] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [noteList, setNoteList] = useState([]);

  useEffect(async () => {
    const noteFilter = {
      user: user.email,
      code: fiat.id,
    };
    const notes = await getNotes(noteFilter);
    setNoteList(notes);
  }, [fiat, user]);

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

  const handleFiatUpdate = (newAmount) => {
    const res = updateFiat(fiat.id, newAmount);
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
    refreshFiatData();
    const res = await deleteFiat(fiat.id);
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
      />
      <hr className={styles.solidDivider} />
      <DetailPageButtons
        showModal={showModal}
        handleDelete={handleDeleteFiat}
        handleCancel={handleCancel}
        isShown={isShown}
        deleted={deleted}
        cancel={cancel}
        buttonText={"update"}
        deletionText={"currency"}
        deletionSubText={" your notes will also be deleted"}
      />
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const code = query.id;
  const appCurrencySign = query.appCurrencySign;
  const fiat = await getSingleFiatData(code);

  // console.log(fiat);

  return {
    props: {
      fiat,
      appCurrencySign,
    },
  };
}

export default Fiat;
