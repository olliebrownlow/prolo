import React from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.scss";
import UpdateForm from "./update-form";

const UpdateModal = (props) => {
  const {
    closeModal,
    windowOnClick,
    handleFormSubmit,
    name,
    code,
    amount,
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
        <UpdateForm
          handleFormSubmit={handleFormSubmit}
          name={name}
          code={code}
          closeModal={closeModal}
          amount={amount}
        />
        <hr className={styles.solidDivider} />
        <button className={styles.cancelButton} onClick={closeModal}>
          cancel
        </button>
      </div>
    </aside>,
    document.body
  );
};

export default UpdateModal;
