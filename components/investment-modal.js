import React from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.scss";
import AddInvestmentItemForm from "./add-investment-item-form";

const InvestmentModal = (props) => {
  const { closeModal, windowOnClick, handleFormSubmit } = props;

  return ReactDOM.createPortal(
    <aside className={styles.modalCover} onClick={windowOnClick}>
      <div className={styles.modalArea}>
        <button className={styles._modalClose} onClick={closeModal}>
          <span className={styles._hideVisual}>Close</span>
          <svg className={styles._modalCloseIcon} viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
          </svg>
        </button>
        <AddInvestmentItemForm
          handleFormSubmit={handleFormSubmit}
          closeModal={closeModal}
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

export default InvestmentModal;
