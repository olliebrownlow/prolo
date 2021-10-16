import AddButton from "./add-button";
import React, { useState } from "react";
import ModalContainer from "./modal-container";
import { addCoin, addFiat } from "../actions";
import Router from "next/router";

const Modal = (props) => {
  const [isShown, setIsShown] = useState(false);
  const { buttonText, labelName, data } = props;

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

  const refreshCoinData = () => {
    Router.replace("/pocket");
  };

  const refreshFiatData = () => {
    window.location = "/pocket";
  };

  const handleAddCoinOrFiat = async (currency) => {
    let res = "";
    if (currency.sign) {
      res = await addFiat(currency);
      refreshFiatData();
    } else {
      res = await addCoin(currency);
      refreshCoinData();
    }
    console.log(res);
    closeModal();
  };

  return (
    
    <>
      <AddButton
        buttonText={buttonText}
        showModal={showModal}
        showLogo={true}
      />
      {isShown ? (
        <ModalContainer
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleAddCoinOrFiat}
          title={buttonText}
          labelName={labelName}
          data={data}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default Modal;
