import AddButton from "./add-button";
import React, { useState } from "react";
import ModalContainer from "./modal-container";
import { addCoin, addFiat } from "../actions";
import Router from "next/router";

const Modal = (props) => {
  const [isShown, setIsShown] = useState(false);
  const {
    buttonText,
    labelName,
    data,
    dataOptionsExhausted,
    userEmail,
    type,
  } = props;

  const showModal = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsShown(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(false);
    }
  };

  const refreshData = () => {
    Router.replace("/pocket", undefined, { scroll: false });
    setTimeout(closeModal, 1000);
  };

  const handleAddCoinOrFiat = async (currency) => {
    currency.user = userEmail;
    let res = "";
    if (currency.sign) {
      res = await addFiat(currency);
    } else {
      res = await addCoin(currency);
    }
    refreshData();
    console.log(res);
  };

  return (
    <>
      <AddButton
        buttonText={buttonText}
        showModal={showModal}
        showLogo={true}
        isShown={isShown}
      />
      {isShown ? (
        <ModalContainer
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleAddCoinOrFiat}
          title={buttonText}
          labelName={labelName}
          data={data}
          type={type}
          isShown={isShown}
          dataOptionsExhausted={dataOptionsExhausted}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default Modal;
