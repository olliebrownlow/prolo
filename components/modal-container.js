import React from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.scss";
import AddForm from "./add-form";
import NoSupport from "./no-support";
import coinSelectOptions from "../config/coinSelectOptions";
import fiatSelectOptions from "../config/fiatSelectOptions";

const ModalContainer = (props) => {
  const {
    closeModal,
    windowOnClick,
    handleFormSubmit,
    title,
    labelName,
    data,
  } = props;

  return ReactDOM.createPortal(
    <aside className={styles.modalCover} onClick={windowOnClick}>
      <div className={styles.modalArea}>
        <button className={styles._modalClose} onClick={closeModal}>
          <span className={styles._hideVisual}>Close</span>
          <svg className={styles._modalCloseIcon} viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </svg>
        </button>
        {(coinSelectOptions.length === data.length && labelName === "coin") ||
        (fiatSelectOptions.length === data.length && labelName === "fiat") ? (
          <NoSupport labelName={labelName} title={title} />
        ) : (
          <>
            <AddForm
              handleFormSubmit={handleFormSubmit}
              title={title}
              labelName={labelName}
              closeModal={closeModal}
              data={data}
            />
            <hr className={styles.solidDivider} />
            <button className={styles.cancelButton} onClick={closeModal}>
              cancel
            </button>
          </>
        )}
      </div>
    </aside>,
    document.body
  );
};

export default ModalContainer;
