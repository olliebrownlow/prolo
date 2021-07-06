import AddButton from "./add-button";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ModalContainer from "./modal-container";
import { addCoin, addFiat } from "../actions";

const Modal = (props) => {
  const [isShown, setIsShown] = useState(false);
  const { buttonText, labelName, data } = props;
  const router = useRouter();

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
    window.location = "/pocket";
  };

  const handleAddCoinOrFiat = async (currency) => {
    if (currency.sign) {
      const res = await addFiat(currency);
    } else {
      const res = await addCoin(currency);
    }
    console.log(res)
    closeModal();
    refreshData();
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
