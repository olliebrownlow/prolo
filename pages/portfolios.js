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
import { getProlo } from "../lib/core/profitLossCalc";
import {
  getPortfolios,
  getNextPortfolioNumber,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
  getAllUserFundingData,
  getCurrencyAndTheme,
  setCurrentPortfolioNumber,
} from "../actions";
import toast from "react-hot-toast";
import _ from "lodash";
import { Trash2, Edit, Anchor, Copy } from "react-feather";
import { motion } from "framer-motion";

const Portfolios = (props) => {
  const {
    roundTo2DP,
    portfolios,
    balances,
    allInvestmentItems,
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
  const [confirmClone, setConfirmClone] = useState(false);
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

  const showConfirmClone = () => {
    setConfirmClone(true);
    // setPortfolioIndexForDeletion(index);
  };

  const closeModal = () => {
    setIsShown(false);
    setIsShownForUpdating(false);
    setConfirmDeletion(false);
    setConfirmClone(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(false);
      setIsShownForUpdating(false);
      setConfirmDeletion(false);
      setConfirmClone(false);
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
    colour: "red",
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
    if (portfolio.portfolioNumber == getCookie("pn")) {
      console.log("here");
      setCookies("pnm", portfolio.portfolioName);
      setCookies("pc", portfolio.colour);
    }
    console.log(res);
    refreshPortfoliosPage();
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
    toast.error(`switching to ${portfolio.portfolioName}: please wait...`, {
      id: "portfolioSwitch",
    });
    setCookies("pn", portfolio.portfolioNumber);
    setCookies("pnm", portfolio.portfolioName);
    setCookies("pc", portfolio.colour);
    await setCurrentPortfolioNumber({
      userNumber: portfolio.userNumber,
      newSettings: { currentPortfolioNumber: portfolio.portfolioNumber },
    });
    refreshPortfoliosPage();
  };

  const getBalances = (portfolioNumber) => {
    return balances.find(
      (pfBalances) => pfBalances.portfolioNumber === portfolioNumber
    );
  };

  const getInvestmentItems = (portfolioNumber) => {
    const items = allInvestmentItems.filter(
      (item) => item.portfolioNumber === portfolioNumber
    );
    return items;
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
          <div className={styles.contentContainer}>
            {portfolios.map((portfolio, index) => (
              <div key={index}>
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
                            ? styles.lightactivecard
                            : styles.lightinactivecard
                          : portfolio.portfolioNumber ===
                            parseInt(portfolioNumber)
                          ? styles.darkactivecard
                          : styles.darkinactivecard
                      }`
                    }
                  >
                    <div
                      className={
                        styles.title +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelighttitle
                              : styles.inactivelighttitle
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarktitle
                            : styles.inactivedarktitle
                        }`
                      }
                      style={{
                        backgroundColor: portfolio.colour,
                      }}
                    >
                      {portfolio.portfolioName}
                    </div>
                    {portfolio.portfolioDescription ? (
                      <>
                        <div
                          className={
                            styles.key +
                            " " +
                            `${
                              currencyAndTheme.theme === "light"
                                ? portfolio.portfolioNumber ===
                                  parseInt(portfolioNumber)
                                  ? styles.activelightkey
                                  : styles.inactivelightkey
                                : portfolio.portfolioNumber ===
                                  parseInt(portfolioNumber)
                                ? styles.activedarkkey
                                : styles.inactivedarkkey
                            }`
                          }
                        >
                          description
                        </div>
                        <div
                          className={
                            styles.value +
                            " " +
                            `${
                              currencyAndTheme.theme === "light"
                                ? portfolio.portfolioNumber ===
                                  parseInt(portfolioNumber)
                                  ? styles.activelightvalue
                                  : styles.inactivelightvalue
                                : portfolio.portfolioNumber ===
                                  parseInt(portfolioNumber)
                                ? styles.activedarkvalue
                                : styles.inactivedarkvalue
                            }`
                          }
                        >
                          {portfolio.portfolioDescription}
                        </div>
                      </>
                    ) : (
                      <>
                        <div></div>
                        <div></div>
                        <div></div>
                      </>
                    )}
                    <div
                      className={
                        styles.key +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelightkey
                              : styles.inactivelightkey
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarkkey
                            : styles.inactivedarkkey
                        }`
                      }
                    >
                      pocket
                    </div>
                    <div
                      className={
                        styles.balancevaluetitle +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? styles.lightbalancevaluetitle
                            : styles.darkbalancevaluetitle
                        }`
                      }
                    >
                      coins
                      <br />
                      fiat
                      <br />
                      total
                    </div>
                    <div
                      className={
                        styles.balancevalue +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelightvalue
                              : styles.inactivelightvalue
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarkvalue
                            : styles.inactivedarkvalue
                        }`
                      }
                    >
                      {appCurrencySign}
                      {roundTo2DP(
                        getBalances(portfolio.portfolioNumber).coinTotal
                      )}
                      <br />
                      {appCurrencySign}
                      {roundTo2DP(
                        getBalances(portfolio.portfolioNumber).fiatTotal
                      )}
                      <br />
                      {appCurrencySign}
                      {roundTo2DP(
                        getBalances(portfolio.portfolioNumber).balance
                      )}
                    </div>

                    <div
                      className={
                        styles.key +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelightkey
                              : styles.inactivelightkey
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarkkey
                            : styles.inactivedarkkey
                        }`
                      }
                    >
                      ledger
                    </div>
                    <div
                      className={
                        styles.balancevaluetitle +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? styles.lightbalancevaluetitle
                            : styles.darkbalancevaluetitle
                        }`
                      }
                    >
                      funds
                      <br />
                      pro.lo-
                    </div>
                    <div
                      className={
                        styles.balancevalue +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelightvalue
                              : styles.inactivelightvalue
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarkvalue
                            : styles.inactivedarkvalue
                        }`
                      }
                    >
                      {appCurrencySign}
                      {roundTo2DP(
                        getBalances(portfolio.portfolioNumber).balance -
                          getProlo(
                            appCurrencyName,
                            getInvestmentItems(portfolio.portfolioNumber),
                            getBalances(portfolio.portfolioNumber).balance
                          )
                      )}
                      <br />
                      {appCurrencySign}
                      {roundTo2DP(
                        getProlo(
                          appCurrencyName,
                          getInvestmentItems(portfolio.portfolioNumber),
                          getBalances(portfolio.portfolioNumber).balance
                        )
                      )}
                    </div>
                    <div
                      className={
                        styles.lastkey +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelightlastkey
                              : styles.inactivelightlastkey
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarklastkey
                            : styles.inactivedarklastkey
                        }`
                      }
                    ></div>
                    <div
                      className={
                        styles.lastvalue +
                        " " +
                        `${
                          currencyAndTheme.theme === "light"
                            ? portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                              ? styles.activelightlastvalue
                              : styles.inactivelightlastvalue
                            : portfolio.portfolioNumber ===
                              parseInt(portfolioNumber)
                            ? styles.activedarklastvalue
                            : styles.inactivedarklastvalue
                        }`
                      }
                    ></div>
                    {portfolio.portfolioNumber !==
                      parseInt(portfolioNumber) && (
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
                          ? styles.cloneContainer
                          : styles.cloneContainerNoDelete
                      }
                      whileHover={{ scale: 1.1 }}
                    >
                      <Copy
                        size={24}
                        color={"red"}
                        className={styles.clone}
                        onClick={() => showConfirmClone()}
                      />
                    </motion.div>
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
          </div>
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
          {confirmClone ? (
            <ConfirmDelete
              closeModal={closeModal}
              windowOnClick={windowOnClick}
              handleDelete={handleDeletePortfolio}
              data={null}
              isShown={confirmClone}
              titleText={"clone this portfolio"}
              subText={
                " all coins, currencies, investment items and note data associated with this portfolio will be copied over"
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
  const allInvestmentItems = await getAllUserFundingData({
    userNumber: userNumber,
  });

  // nomics api free account only allows one request per second, hence
  // the need to delay each call -> the more portfolios, the longer it
  // takes to render!
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let coinDataPerPortfolio = [];
  await Promise.all(
    portfolios.map(async (pf, index) => {
      await sleep(index * 1250);
      let item = await getCoinData(
        pf.userNumber,
        pf.portfolioNumber,
        currencyCode,
        coinType
      );
      let data = {};
      data[index] = item;
      coinDataPerPortfolio.push(data);
    })
  );

  let fiatDataPerPortfolio = [];
  await Promise.all(
    portfolios.map(async (pf, index) => {
      await sleep(index * 100);
      let item = await getFiatData(
        pf.userNumber,
        pf.portfolioNumber,
        currencyCode
      );
      let data = {};
      data[index] = item;
      fiatDataPerPortfolio.push(data);
    })
  );

  let balances = [];
  for (let i = 0; i < portfolios.length; i++) {
    const balance = calculateBalance(
      coinDataPerPortfolio.find((entry) => entry[`${i}`])[`${i}`],
      fiatDataPerPortfolio.find((entry) => entry[`${i}`])[`${i}`]
    );
    balances.push(balance);
  }

  // console.log(userNumber);
  // console.log(portfolioNumber);
  // console.log(coinType);
  // console.log(currencyCode);
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(allInvestmentItems);
  // console.log(balances);
  // console.log(portfolios);

  return {
    props: {
      portfolios,
      currencyAndTheme,
      balances,
      allInvestmentItems,
      userNumber: userNumber,
      portfolioNumber: portfolioNumber,
    },
  };
}

export default Portfolios;
