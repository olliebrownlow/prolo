import React from "react";
import styles from "./detailPageButtons.module.scss";
import { motion } from "framer-motion";

const DetailPageButtons = (props) => {
  const {
    showModal,
    handleDelete,
    handleCancel,
    isShown,
    deleted,
    cancel,
    buttonText,
  } = props;
  return (
    <div className={styles.buttons}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.25 }}
        animate={isShown ? { scale: [1, 0.5, 1] } : {}}
        className={styles.updateButton}
        onClick={() => showModal()}
        role="button"
      >
        {buttonText}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.25 }}
        animate={deleted ? { scale: [1, 0.5, 1] } : {}}
        className={styles.deleteButton}
        onClick={() => handleDelete()}
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
        exit
      </motion.button>
    </div>
  );
};

export default DetailPageButtons;
