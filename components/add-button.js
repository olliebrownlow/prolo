import React from "react";
import { Plus } from "react-feather";
import styles from "./button.module.scss";
import { motion } from "framer-motion";

const AddButton = (props) => {
  const { buttonText, showModal, showLogo, submitForm } = props;
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
          whileTap={{ scale: 0.5 }}
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
