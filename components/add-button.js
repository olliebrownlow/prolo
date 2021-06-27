import React from "react";
import { Plus } from "react-feather";
import styles from "./button.module.scss";

const AddButton = (props) => {
  const { buttonText } = props;
  return (
    <>
      <div className={styles.buttons}>
        <button className={styles.button + " " + `${styles.listingAddButton}`}>
          {buttonText}
          <span className={styles.logo}>
            <Plus size={18} />
          </span>
        </button>
      </div>
    </>
  );
};

export default AddButton;
