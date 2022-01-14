import AddButton from "./add-button";
import React, { useState, useEffect } from "react";
import styles from "./noteCollapsible.module.scss";
import NoteModal from "./note-modal";
import { getNotes, addNote } from "../actions";
import Router from "next/router";

const NoteCollapsible = (props) => {
  const [isShown, setIsShown] = useState(false);
  const [noteList, setNoteList] = useState([]);
  const { data, user } = props;

  useEffect(async () => {
    const noteFilter = {
      email: user.email,
      id: data,
    };
    const notes = await getNotes(noteFilter);
    setNoteList(notes);
  }, [user, data]);

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

  const refreshPageData = () => {
    // need to not be passing through data via the query to use this
    // const id = getCoinProp("id");
    // Router.replace("/fiat/" + id, undefined, { scroll: false });
    Router.reload();
    // setTimeout(closeModal, 1000);
  };

  // const refreshData = () => {
  //   window.location = "/pocket";
  // };

  const handleAddNote = async (note) => {
    let now = new Date();
    note.dateTime = now;
    note.user = user.email;
    // console.log(JSON.stringify(note))
    const res = await addNote(note);
    refreshPageData();
    console.log(res);
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const d = new Date(date);
    return d.toLocaleString("en-GB", options);
  };

  return (
    <>
      <AddButton
        buttonText={"add note"}
        showModal={showModal}
        showLogo={true}
        isShown={isShown}
        centralisedStyling={true}
      />
      {isShown ? (
        <NoteModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleAddNote}
          title={"new note"}
          data={data}
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
      {noteList.map((note) => (
        <>
          {/* <div className={styles.text}>{JSON.stringify(note)}</div> */}

          <div className={styles.content}>
            <div className={styles.card}>
              {note.noteTitle && (
                <div className={styles.title}>{note.noteTitle}</div>
              )}
              <div className={styles.date}>{formatDate(note.dateTime)}</div>
              <div className={styles.text}>{note.noteContent}</div>
            </div>
          </div>
        </>
      ))}
      <br />
      {noteList.length > 3 ? (
        <AddButton
          buttonText={"add note"}
          showModal={showModal}
          showLogo={true}
          isShown={isShown}
          centralisedStyling={true}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default NoteCollapsible;
