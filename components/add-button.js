import React from "react";
import { Plus } from "react-feather";
import styles from "./button.module.scss";
import { motion } from "framer-motion";

const AddButton = (props) => {
  const { buttonText, showModal, showLogo, submitForm, isShown, isButtonDisabled } = props;

  return (
    <>
      <div className={styles.buttons}>
        <motion.button
          className={
            styles.button +
            " " +
            `${showLogo ? styles.listingAddButton : styles.modalAddButton}`
          }
          onClick={showLogo ? showModal : submitForm}
          disabled={isButtonDisabled}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={isShown ? { scale: [1, 0.5, 1] } : {}}
        >
          {buttonText}
          {showLogo && (
            <span className={styles.logo}>
              <Plus size={18} />
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default AddButton;
