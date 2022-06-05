import styles from "./portfolioSwitchForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import AddButton from "./add-button";
import { getCookie } from "cookies-next";

const PortfolioSwitchForm = (props) => {
  const { title, data, handleFormSubmit, closeModal } = props;

  const [currentPortfolio, setCurrentPortfolio] = useState(
    data.find((entry) => entry.portfolioNumber === parseInt(getCookie("pn")))
  );
  const [isShown, setIsShown] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    const prtNum = target.title;
    setCurrentPortfolio(
      data.find((entry) => entry.portfolioNumber === parseInt(prtNum))
    );
  };

  const delayAndCloseModal = (ms) =>
    new Promise(() => setTimeout(closeModal, ms));

  const submitSettings = async () => {
    if (currentPortfolio.portfolioNumber === parseInt(getCookie("pn"))) {
      toast.error("please select a different portfolio or cancel", {
        id: "noNewPortfolio",
      });
    } else {
      setIsButtonDisabled(true);
      setIsShown(true);
      handleFormSubmit(currentPortfolio);
      await delayAndCloseModal(1000);
      setIsButtonDisabled(false);
      setIsShown(false);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>{title}</h1>
      <hr className={styles.solidDivider} />
      <div className={styles.portfolioButtons}>
        {data.map((portfolio) => (
          <div
            className={styles.button}
            key={portfolio.portfolioNumber}
            style={
              portfolio.portfolioNumber === currentPortfolio.portfolioNumber
                ? {
                    backgroundColor: `${portfolio.colour}`,
                    fontSize: "28px",
                    borderWidth: "3px",
                  }
                : {
                    backgroundColor: "#292929",
                    fontSize: "22px",
                    borderWidth: "1px",
                  }
            }
            title={portfolio.portfolioNumber}
            onClick={handleChange}
          >
            {portfolio.portfolioName}
          </div>
        ))}
      </div>
      <AddButton
        buttonText={"set"}
        showModal={false}
        showLogo={false}
        submitForm={submitSettings}
        isShown={isShown}
        isButtonDisabled={isButtonDisabled}
        centralisedStyling={false}
      />
    </>
  );
};

export default PortfolioSwitchForm;
