import React from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.scss";
import AddOrUpdateNoteForm from "./add-or-update-note-form";
import { motion } from "framer-motion";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const NoteModal = (props) => {
  const {
    closeModal,
    windowOnClick,
    handleFormSubmit,
    title,
    data,
    isShown,
    addButtonText,
  } = props;

  return ReactDOM.createPortal(
    <motion.aside
      className={styles.modalCover}
      onClick={windowOnClick}
      animate={isShown ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay: 0.2 }}
      initial="hidden"
    >
      <div className={styles.modalArea}>
        <motion.button
          className={styles._modalClose}
          onClick={closeModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.5 }}
        >
          <span className={styles._hideVisual}>Close</span>
          <svg className={styles._modalCloseIcon} viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </svg>
        </motion.button>
        <AddOrUpdateNoteForm
          handleFormSubmit={handleFormSubmit}
          title={title}
          data={data}
          isShown={isShown}
          addButtonText={addButtonText}
        />
        <hr className={styles.solidDivider} />
        <motion.button
          className={styles.cancelButton}
          onClick={closeModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.5 }}
        >
          cancel
        </motion.button>
      </div>
    </motion.aside>,
    document.body
  );
};

export default NoteModal;
