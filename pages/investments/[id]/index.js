import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../lib/UserContext";
import {
  getNotes,
  deleteInvestmentItem,
  getHistoricalData,
  updateInvestmentItem,
  deleteAssociatedNotes,
} from "../../../actions";
import Router from "next/router";
import Image from "next/image";
import eurFlag from "../../../public/eurFlagSmall.jpg";
import gbpFlag from "../../../public/gbpFlagSmall.png";
import usdFlag from "../../../public/usdFlagSmall.jpg";
import CorrectModal from "../../../components/correct-modal";
import MrktInfoRow from "../../../components/mrkt-info-row";
import NoteCollapsible from "../../../components/note-collapsible";
import DetailPageButtons from "../../../components/detail-page-buttons";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import _ from "lodash";

const Investment = (props) => {
  const [user] = useContext(UserContext);
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
    sortingNumber,
    roundTo2DP,
  } = props;

  const [isShown, setIsShown] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [noteList, setNoteList] = useState([]);

  useEffect(async () => {
    const noteFilter = {
      user: user.email,
      code: id,
    };
    const notes = await getNotes(noteFilter);
    setNoteList(notes);
  }, [id, user]);

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

  const refreshInvestmentData = () => {
    Router.replace("/ledger");
  };

  const handleUpdate = async (correctedItem) => {
    refreshInvestmentData();

    if (correctedItem.date.length === 10) {
      correctedItem.sortingNumber = Number(
        _.words(correctedItem.date).join("")
      );
    }

    if (correctedItem.date.length === 8) {
      const array = correctedItem.date.split("-");
      array.reverse();
      array[0] = `20${array[0]}`;
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
    const res2 = deleteAssociatedNotes(noteList);
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
          sortingNumber={sortingNumber}
          label="funding item"
          isShown={isShown}
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
      <MrktInfoRow key1={"type"} value1={type} key2={"date"} value2={date} />
      {roundTo2DP(euros) === roundTo2DP(amount) ? (
        <MrktInfoRow
          key1={"sterling value"}
          value1={"£" + `${roundTo2DP(britishSterling)}`}
          key2={"dollar value"}
          value2={"$" + `${roundTo2DP(americanDollars)}`}
        />
      ) : (
        <React.Fragment />
      )}
      {roundTo2DP(britishSterling) === roundTo2DP(amount) ? (
        <MrktInfoRow
          key1={"euro value"}
          value1={"€" + `${roundTo2DP(euros)}`}
          key2={"dollar value"}
          value2={"$" + `${roundTo2DP(americanDollars)}`}
        />
      ) : (
        <React.Fragment />
      )}
      {roundTo2DP(americanDollars) === roundTo2DP(amount) ? (
        <MrktInfoRow
          key1={"euro value"}
          value1={"€" + `${roundTo2DP(euros)}`}
          key2={"sterling value"}
          value2={"£" + `${roundTo2DP(britishSterling)}`}
        />
      ) : (
        <React.Fragment />
      )}
      <NoteCollapsible
        data={id}
        notes={noteList}
        notepadSettingType={"showFundingItemNotepad"}
      />
      <hr className={styles.solidDivider} />
      <DetailPageButtons
        showModal={showModal}
        handleDelete={handleDelete}
        handleCancel={handleCancel}
        isShown={isShown}
        deleted={deleted}
        cancel={cancel}
        buttonText={"correct"}
        deletionText={`${type} item`}
      />
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
  const sortingNumber = query.sortingNumber;

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
      sortingNumber,
    },
  };
}

export default Investment;
