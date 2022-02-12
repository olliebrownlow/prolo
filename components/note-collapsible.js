import AddButton from "./add-button";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../lib/UserContext";
import styles from "./noteCollapsible.module.scss";
import NoteModal from "./note-modal";
import ConfirmDelete from "./confirm-delete";
import {
  addNote,
  updateNote,
  deleteNote,
  getNotepadSettings,
  updateNotepadSettings,
} from "../actions";
import Router from "next/router";
import { Trash2, Edit, ChevronDown } from "react-feather";
import { motion } from "framer-motion";

const variants = {
  open: {
    opacity: 1,
    height: "auto",
  },
  closed: { opacity: 0, height: 0, overflow: "hidden" },
};

const NoteCollapsible = (props) => {
  const [user] = useContext(UserContext);
  const [isShown, setIsShown] = useState(false);
  const [isShownForUpdating, setIsShownForUpdating] = useState(false);
  const [noteList, setNoteList] = useState([]);
  const [note, setNote] = useState({});
  const [noteIdForDeletion, setNoteIdForDeletion] = useState("");
  const [showNotepad, setShowNotepad] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const { data, notes, notepadSettingType, pageType } = props;

  useEffect(async () => {
    setNoteList(notes);
    const notepadSettings = await getNotepadSettings();
    setShowNotepad(notepadSettings[0][notepadSettingType]);
  }, [notes, notepadSettingType]);

  const handleNotepadSettingUpdate = (newSetting) => {
    const res = updateNotepadSettings(newSetting);
    console.log(res);
  };

  const toggleShowNotepad = () => {
    const newSetting = {
      [notepadSettingType]: !showNotepad,
    };
    setShowNotepad(!showNotepad);
    handleNotepadSettingUpdate(newSetting);
  };

  const showModal = () => {
    setIsShown(true);
  };

  const showUpdateModal = (note) => {
    setIsShownForUpdating(true);
    setNote(note);
  };

  const showConfirmDelete = (id) => {
    setConfirmDeletion(true);
    setNoteIdForDeletion(id);
  };

  const closeModal = () => {
    setIsShown(false);
    setIsShownForUpdating(false);
    setConfirmDeletion(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(false);
      setIsShownForUpdating(false);
      setConfirmDeletion(false);
    }
  };

  const emptyNote = {
    id: "",
    code: data,
    noteTitle: "",
    noteContent: "",
  };

  const refreshPageData = () => {
    if (pageType) {
      Router.replace(`/${pageType}/${data}`, undefined, { scroll: false });
    } else {
      Router.reload;
    }
    setTimeout(closeModal, 1000);
  };

  const handleAddNote = async (note) => {
    let now = new Date();
    note.dateTime = now;
    note.user = user.email;
    const res = await addNote(note);
    refreshPageData();
    console.log(res);
  };

  const handleUpdateNote = async (note) => {
    let now = new Date();
    note.dateTime = now;
    const res = await updateNote(note.id, note);
    refreshPageData();
    console.log(res);
  };

  const handleDeleteNote = async (id) => {
    const res = await deleteNote(id);
    refreshPageData();
    console.log(res);
  };

  // when user has no notes, an
  // empty array must be returned for
  // reliable mapping.
  const emptyOrOrderedArray = () => {
    if (noteList.length) {
      return noteList.sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
      );
    } else {
      return [];
    }
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
      <motion.div
        className={styles.marketHeading}
        onClick={toggleShowNotepad}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.span
          animate={
            showNotepad
              ? { transform: "rotateX(180deg)" }
              : { transform: "rotateX(0deg)" }
          }
          transition={{ duration: 0.5 }}
          initial={false}
        >
          <ChevronDown />
        </motion.span>
        notepad
        <motion.span className={styles.hidden}>
          <ChevronDown />
        </motion.span>
      </motion.div>
      <motion.div
        className={styles.collapsibleLayout}
        animate={showNotepad ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        initial={false}
      >
        {user?.loading ? (
          <div>loading notes...</div>
        ) : (
          user?.issuer && (
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
                  data={emptyNote}
                  isShown={isShown}
                  addButtonText={"add"}
                />
              ) : (
                <React.Fragment />
              )}
              {isShownForUpdating ? (
                <NoteModal
                  closeModal={closeModal}
                  windowOnClick={windowOnClick}
                  handleFormSubmit={handleUpdateNote}
                  title={"update note"}
                  data={note}
                  isShown={isShownForUpdating}
                  addButtonText={"update"}
                />
              ) : (
                <React.Fragment />
              )}
              {emptyOrOrderedArray().map((note, index) => (
                <div className={styles.contentContainer} key={index}>
                  <motion.div
                    className={styles.content}
                    whileInView={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                  >
                    <div className={styles.card}>
                      {note.noteTitle && (
                        <div className={styles.title}>{note.noteTitle}</div>
                      )}
                      <div className={styles.date}>
                        {formatDate(note.dateTime)}
                      </div>
                      <div className={styles.text}>{note.noteContent}</div>
                      <motion.div
                        whileTap={{ scale: 0.5 }}
                        className={styles.editContainer}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Edit
                          size={24}
                          color={"red"}
                          className={styles.edit}
                          onClick={() => showUpdateModal(note)}
                        />
                      </motion.div>
                      <motion.div
                        whileTap={{ scale: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        className={styles.trashContainer}
                      >
                        <Trash2
                          size={24}
                          className={styles.trash}
                          onClick={() => showConfirmDelete(note.id)}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ))}
              <br />
              {noteList.length > 2 ? (
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
              {confirmDeletion ? (
                <ConfirmDelete
                  closeModal={closeModal}
                  windowOnClick={windowOnClick}
                  handleDelete={handleDeleteNote}
                  data={noteIdForDeletion}
                  isShown={confirmDeletion}
                  titleText={"note"}
                />
              ) : (
                <React.Fragment />
              )}
            </>
          )
        )}
      </motion.div>
    </>
  );
};

export default NoteCollapsible;
