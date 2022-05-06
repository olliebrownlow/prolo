import React, { useContext, useState } from "react";
import Router from "next/router";
import { getCookie } from "cookies-next";
import CurrencySettingsContext from "../context/currencySettings";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import SettingsLink from "../components/settings-link";
import AddButton from "../components/add-button";
import PortfolioModal from "../components/portfolio-modal";
import NotLoggedIn from "../components/not-logged-in";
import styles from "../pageStyles/portfolios.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";
import {
  getPortfolios,
  getNextPortfolioNumber,
  addPortfolio,
  getCurrencyAndTheme,
} from "../actions";
import _ from "lodash";
import { Trash2, Edit } from "react-feather";
import { motion } from "framer-motion";

const Portfolios = (props) => {
  const {
    roundTo2DP,
    portfolios,
    balances,
    investmentItems,
    userNumber,
    portfolioNumber,
    currencyAndTheme,
  } = props;

  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyName } = useContext(
    CurrencySettingsContext
  );
  const [isShown, setIsShown] = useState(false);

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

  const refreshFPortfoliosPage = () => {
    Router.replace("/portfolios", undefined, { scroll: false });
  };

  const basePortfolioData = {
    userNumber: parseInt(userNumber),
    portfolioName: "",
    portfolioDescription: "",
  };

  const handleAddPortfolio = async (portfolio) => {
    const newPortfolioNumber = await getNextPortfolioNumber();
    portfolio.portfolioNumber = newPortfolioNumber;
    const res = await addPortfolio(portfolio);
    refreshFPortfoliosPage();
    console.log(res);
    closeModal();
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <SettingsLink pageName={"portfolios"} />
          <div className={styles.heading}>portfolios</div>
          <AddButton
            buttonText={"add portfolio"}
            showModal={showModal}
            showLogo={true}
            isShown={isShown}
          />
          {isShown ? (
            <PortfolioModal
              closeModal={closeModal}
              windowOnClick={windowOnClick}
              handleFormSubmit={handleAddPortfolio}
              isShown={isShown}
              data={basePortfolioData}
              title={"new portfolio"}
              addButtonText={"add"}
            />
          ) : (
            <React.Fragment />
          )}
          {portfolios.map((portfolio, index) => (
            <div className={styles.contentContainer} key={index}>
              <motion.div
                className={styles.content}
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <div
                  className={
                    styles.card +
                    " " +
                    `${
                      currencyAndTheme.theme === "light"
                        ? styles.light
                        : styles.dark
                    }`
                  }
                >
                  <div className={styles.title}>{portfolio.portfolioName}</div>
                  {portfolio.portfolioDescription && (
                    <div className={styles.text}>
                      {portfolio.portfolioDescription}
                    </div>
                  )}
                  <motion.div
                    whileTap={{ scale: 0.5 }}
                    className={styles.editContainer}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit
                      size={24}
                      color={"red"}
                      className={styles.edit}
                      // onClick={() => showUpdateModal(portfolio)}
                    />
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    className={styles.trashContainer}
                  >
                    <Trash2
                      size={24}
                      className={styles.trash}
                      // onClick={() =>
                      //   showConfirmDelete(portfolio.portfolioNumber)
                      // }
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </>
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
};

export async function getServerSideProps({ req, res }) {
  const userNumber = getCookie("un", { req, res });
  const portfolioNumber = getCookie("pn", { req, res });
  const coinType = getCookie("ct", { req, res });
  const currencyCode = getCookie("cc", { req, res });
  const portfolios = await getPortfolios({ userNumber: userNumber });
  const currencyAndTheme = await getCurrencyAndTheme(userNumber);

  const coinData = await getCoinData(
    userNumber,
    portfolioNumber,
    currencyCode,
    coinType
  );
  const fiatData = await getFiatData(userNumber, portfolioNumber, currencyCode);
  const balances = await calculateBalance(coinData, fiatData);

  // console.log(userNumber);
  // console.log(portfolioNumber);
  // console.log(coinType);
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(balances);
  // console.log(investmentItems);

  return {
    props: {
      portfolios,
      currencyAndTheme,
      balances,
      userNumber: userNumber,
      portfolioNumber: portfolioNumber,
    },
  };
}

export default Portfolios;
