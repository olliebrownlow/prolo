import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../lib/UserContext";
import { getCookie } from "cookies-next";
import {
  getNotes,
  getSingleInvestmentItem,
  deleteInvestmentItem,
  getHistoricalData,
  updateInvestmentItem,
  deleteAssociatedNotes,
  getCurrencyAndTheme,
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
  const { investmentItem, currencyAndTheme, userNumber, roundTo2DP } = props;

  const [isShown, setIsShown] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    const handleNotes = async () => {
      const noteFilter = {
        userNumber: userNumber,
        code: investmentItem.id,
      };
      const notes = await getNotes(noteFilter);
      setNoteList(notes);
    };
    handleNotes();
  }, [investmentItem, user]);

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
    Router.replace("/ledger", undefined, { scroll: false });
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

    const res = await updateInvestmentItem(correctedItem);
    console.log(res);
  };

  const handleDelete = () => {
    refreshInvestmentData();
    const res = deleteInvestmentItem(investmentItem.id, userNumber);
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
          src={getFlag(investmentItem.currencySign)}
          alt={investmentItem.currencyName}
          layout="fill"
          priority
        />
      </div>
      {isShown ? (
        <CorrectModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          investmentItem={investmentItem}
          label="funding item"
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{investmentItem.currencyName}</div>
      <div className={styles.code2}>[{investmentItem.currencyCode}]</div>
      <div className={styles.amount}>
        {investmentItem.currencySign}
        {roundTo2DP(investmentItem.amount)}
      </div>
      <MrktInfoRow
        key1={"type"}
        value1={investmentItem.type}
        key2={"date"}
        value2={investmentItem.date}
      />
      {roundTo2DP(investmentItem.euros) ===
      roundTo2DP(investmentItem.amount) ? (
        <MrktInfoRow
          key1={"sterling value"}
          value1={"£" + `${roundTo2DP(investmentItem.britishSterling)}`}
          key2={"dollar value"}
          value2={"$" + `${roundTo2DP(investmentItem.americanDollars)}`}
        />
      ) : (
        <React.Fragment />
      )}
      {roundTo2DP(investmentItem.britishSterling) ===
      roundTo2DP(investmentItem.amount) ? (
        <MrktInfoRow
          key1={"euro value"}
          value1={"€" + `${roundTo2DP(investmentItem.euros)}`}
          key2={"dollar value"}
          value2={"$" + `${roundTo2DP(investmentItem.americanDollars)}`}
        />
      ) : (
        <React.Fragment />
      )}
      {roundTo2DP(investmentItem.americanDollars) ===
      roundTo2DP(investmentItem.amount) ? (
        <MrktInfoRow
          key1={"euro value"}
          value1={"€" + `${roundTo2DP(investmentItem.euros)}`}
          key2={"sterling value"}
          value2={"£" + `${roundTo2DP(investmentItem.britishSterling)}`}
        />
      ) : (
        <React.Fragment />
      )}
      <NoteCollapsible
        data={investmentItem.id}
        notes={noteList}
        notepadSettingType={"showFundingItemNotepad"}
        pageType={"investments"}
        theme={currencyAndTheme.theme}
      />
      <hr className={styles.solidDivider} />
      <DetailPageButtons
        showModal={showModal}
        handleDelete={handleDelete}
        handleCancel={handleCancel}
        isShown={isShown}
        cancel={cancel}
        buttonText={"correct"}
        deletionText={`delete this ${investmentItem.type} item`}
        deletionSubText={" your notes will also be deleted"}
      />
    </div>
  );
};

export async function getServerSideProps({ query, req, res }) {
  const id = query.id;
  const userNumber = getCookie("un", { req, res });
  const investmentItem = await getSingleInvestmentItem({
    id: id,
    userNumber: userNumber,
  });
  const currencyAndTheme = await getCurrencyAndTheme(userNumber);

  // console.log(id);
  // console.log(userNumber);
  // console.log(investmentItem);

  return {
    props: {
      investmentItem,
      currencyAndTheme,
      userNumber: userNumber,
    },
  };
}

export default Investment;
