import CustomiseButton from "./customise-button";
import React, { useState } from "react";
import CustomiseModalContainer from "./customise-modal-container";

const CustomiseMonitor = (props) => {
  const [isShown, setIsShown] = useState(false);
  const { buttonText, handleFormSubmit, currentSettings } = props;

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

  return (
    <>
      <CustomiseButton
        buttonText={buttonText}
        showModal={showModal}
        showLogo={true}
        isShown={isShown}
      />
      {isShown ? (
        <CustomiseModalContainer
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleFormSubmit}
          currentSettings={currentSettings}
          title={"customise display"}
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default CustomiseMonitor;
