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

  const handleAddCoinOrFiat = (currency) => {
    if (currency.sign) {
      console.log("fiat");
      addFiat(currency).then((fiat) => {
        console.log(JSON.stringify(fiat));
        closeModal();
        router.push("/pocket");
      });
    } else {
      console.log("coin");
      addCoin(currency).then((coins) => {
        console.log(JSON.stringify(coins));
        closeModal();
        router.push("/pocket");
      });
    }
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
