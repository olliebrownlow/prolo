import React, { useContext, useState } from "react";
import Router from "next/router";
import { setCookies, getCookie } from "cookies-next";
import CurrencySettingsContext from "../context/currencySettings";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import SettingsLink from "../components/settings-link";
import ConfirmDelete from "../components/confirm-delete";
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
  updatePortfolio,
  deletePortfolio,
  getCurrencyAndTheme,
  setCurrentPortfolioNumber,
} from "../actions";
import _ from "lodash";
import { Trash2, Edit, Anchor } from "react-feather";
import { motion } from "framer-motion";

const Portfolios = (props) => {
  const {
    roundTo2DP,
    portfolios,
    balances,
    userNumber,
    portfolioNumber,
    currencyAndTheme,
  } = props;

  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyName } = useContext(
    CurrencySettingsContext
  );
  const [isShown, setIsShown] = useState(false);
  const [isShownForUpdating, setIsShownForUpdating] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [portfolio, setPortfolio] = useState({});
  const [portfolioIndexForDeletion, setPortfolioIndexForDeletion] = useState();

  const showModal = () => {
    setIsShown(true);
  };

  const showUpdateModal = (portfolio) => {
    setIsShownForUpdating(true);
    setPortfolio(portfolio);
  };

  const showConfirmDelete = (index) => {
    setConfirmDeletion(true);
    setPortfolioIndexForDeletion(index);
  };

  const closeModal = () => {
    setIsShown(false);
    setIsShownForUpdating(false);
    setConfirmDeletion(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(false);
      setIsShownForUpdating(false);
      setConfirmDeletion(false);
    }
  };

  const refreshPortfoliosPage = () => {
    Router.replace("/portfolios", undefined, { scroll: false });
    setTimeout(closeModal, 1000);
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
    refreshPortfoliosPage();
    console.log(res);
  };

  const handleUpdatePortfolio = async (portfolio) => {
    const res = await updatePortfolio(portfolio);
    refreshPortfoliosPage();
    console.log(res);
  };

  const handleDeletePortfolio = async (index) => {
    const res = await deletePortfolio(
      portfolios[index].portfolioNumber,
      portfolios.length
    );
    console.log(res);
    if (portfolios[index].portfolioNumber === parseInt(portfolioNumber)) {
      if (index > 0) {
        anchorPortfolio(portfolios[0]);
      } else {
        anchorPortfolio(portfolios[1]);
      }
      return;
    }
    refreshPortfoliosPage();
  };

  const anchorPortfolio = async (portfolio) => {
    setCookies("pn", portfolio.portfolioNumber);
    await setCurrentPortfolioNumber({
      userNumber: portfolio.userNumber,
      newSettings: { currentPortfolioNumber: portfolio.portfolioNumber },
    });
    refreshPortfoliosPage();
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
          {isShownForUpdating ? (
            <PortfolioModal
              closeModal={closeModal}
              windowOnClick={windowOnClick}
              handleFormSubmit={handleUpdatePortfolio}
              isShown={isShownForUpdating}
              data={portfolio}
              title={"update portfolio"}
              addButtonText={"update"}
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
                        ? portfolio.portfolioNumber ===
                          parseInt(portfolioNumber)
                          ? styles.lightactive
                          : styles.lightinactive
                        : portfolio.portfolioNumber ===
                          parseInt(portfolioNumber)
                        ? styles.darkactive
                        : styles.darkinactive
                    }`
                  }
                >
                  <div className={styles.title}>{portfolio.portfolioName}</div>
                  {portfolio.portfolioDescription && (
                    <div className={styles.text}>
                      {portfolio.portfolioDescription}
                    </div>
                  )}
                  {portfolio.portfolioNumber !== parseInt(portfolioNumber) && (
                    <motion.div
                      whileTap={{ scale: 0.5 }}
                      className={styles.anchorContainer}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Anchor
                        size={24}
                        color={"red"}
                        className={styles.anchor}
                        onClick={() => anchorPortfolio(portfolio)}
                      />
                    </motion.div>
                  )}
                  <motion.div
                    whileTap={{ scale: 0.5 }}
                    className={
                      portfolios.length > 1
                        ? styles.editContainer
                        : styles.editContainerNoDelete
                    }
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit
                      size={24}
                      color={"red"}
                      className={styles.edit}
                      onClick={() => showUpdateModal(portfolio)}
                    />
                  </motion.div>
                  {portfolios.length > 1 && (
                    <motion.div
                      whileTap={{ scale: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                      className={styles.trashContainer}
                    >
                      <Trash2
                        size={24}
                        className={styles.trash}
                        onClick={() => showConfirmDelete(index)}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
          {confirmDeletion ? (
            <ConfirmDelete
              closeModal={closeModal}
              windowOnClick={windowOnClick}
              handleDelete={handleDeletePortfolio}
              data={portfolioIndexForDeletion}
              isShown={confirmDeletion}
              titleText={"delete this portfolio"}
              subText={
                " all coins, currencies, investment items and note data associated with this portfolio will be permanently deleted"
              }
            />
          ) : (
            <React.Fragment />
          )}
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
  // console.log(portfolios.length);

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
