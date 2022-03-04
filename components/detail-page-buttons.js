import React, { useState } from "react";
import ConfirmDelete from "./confirm-delete";
import styles from "./detailPageButtons.module.scss";
import { motion } from "framer-motion";

const DetailPageButtons = (props) => {
  const {
    showModal,
    type,
    handleDelete,
    handleCancel,
    isShown,
    cancel,
    buttonText,
    deletionText,
    deletionSubText,
  } = props;

  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const closeModal = () => {
    setConfirmDeletion(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setConfirmDeletion(false);
    }
  };

  const showConfirmDelete = () => {
    setConfirmDeletion(true);
  };

  return (
    <>
      {confirmDeletion ? (
        <ConfirmDelete
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleDelete={handleDelete}
          data={""}
          isShown={confirmDeletion}
          titleText={deletionText}
          subText={deletionSubText}
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.buttons}>
        {type !== "monitoring" && (
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
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={confirmDeletion ? { scale: [1, 0.5, 1] } : {}}
          className={styles.deleteButton}
          onClick={() => showConfirmDelete()}
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
    </>
  );
};

export default DetailPageButtons;
