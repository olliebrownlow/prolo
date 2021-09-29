import AddButton from "./add-button";
import React, { useState } from "react";
import ModalContainer from "./modal-container";
import { addCoin, addFiat } from "../actions";
import Router from 'next/router';

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

  const refreshData = () => {
    Router.push("/pocket");
  };

  const handleAddCoinOrFiat = async (currency) => {
    let res = "";
    if (currency.sign) {
      res = await addFiat(currency);
    } else {
      res = await addCoin(currency);
    }
    console.log(res);
    refreshData();
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
