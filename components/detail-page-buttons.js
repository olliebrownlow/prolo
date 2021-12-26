import React from "react";
import styles from "./detailPageButtons.module.scss";
import { motion } from "framer-motion";

const DetailPageButtons = (props) => {
  const { showModal, handleDeleteCoin, handleCancel, isShown, deleted, cancel } = props;
  return (
    // <div className={styles.pageLayout}>
    <div className={styles.buttons}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.25 }}
        animate={isShown ? { scale: [1, 0.5, 1] } : {}}
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
        onClick={() => handleDeleteCoin()}
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
    // </div>
  );
};

export default DetailPageButtons;
