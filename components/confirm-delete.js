import React from "react";
import ReactDOM from "react-dom";
import { HelpCircle, Info } from "react-feather";
import styles from "./confirmDelete.module.scss";
import { motion } from "framer-motion";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const ConfirmDelete = (props) => {
  const {
    closeModal,
    windowOnClick,
    handleDelete,
    isShown,
    data,
    titleText,
    subText,
  } = props;

  const delayAndClose = () => {
    setTimeout(closeModal, 500);
  };

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
        <HelpCircle color={"red"} size={50} stroke-width={1.5} />
        <div className={styles.text}>
          are you sure you want to {titleText}?{" "}
        </div>
        <div className={styles.buttons}>
          <motion.button
            className={styles.cancelButton}
            onClick={() => {
              delayAndClose();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.5 }}
          >
            cancel
          </motion.button>
          <motion.button
            className={styles.deleteButton}
            onClick={() => handleDelete(data)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.5 }}
          >
            confirm
          </motion.button>
        </div>
        {subText && (
          <div className={styles.subText}>
            <Info size={14} />
            {subText}
          </div>
        )}
      </div>
    </motion.aside>,
    document.body
  );
};

export default ConfirmDelete;
