import React from "react";
import { Plus } from "react-feather";
import styles from "./button.module.scss";

const AddButton = (props) => {
  const { buttonText, showModal, showLogo, submitForm } = props;
  return (
    <>
      <div className={styles.buttons}>
        <button
          className={
            styles.button +
            " " +
            `${showLogo ? styles.listingAddButton : styles.modalAddButton}`
          }
          onClick={showLogo ? showModal : submitForm}
        >
          {buttonText}
          {showLogo && (
            <span className={styles.logo}>
              <Plus size={18} />
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default AddButton;
