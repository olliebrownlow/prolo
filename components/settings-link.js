import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { getCurrencyAndTheme, updateCurrencyOrThemeSettings } from "../actions";
import Router from "next/router";
import SettingsModalContainer from "./settings-modal-container";
import styles from "./settingsLink.module.scss";
import { mutate } from "swr";
import { Moon, Sun } from "react-feather";
import { motion } from "framer-motion";

const SettingsLink = (props) => {
  const { pageName } = props;
  const [isShown, setIsShown] = useState(false);
  const [appSettingsInUse, setAppSettingsInUse] = useState("yo");

  useEffect(() => {
    const returnCurrencyAndTheme = async () => {
      const user = getCookie("ue");
      const currencyAndTheme = await getCurrencyAndTheme(user);
      setAppSettingsInUse(currencyAndTheme);
    };
    returnCurrencyAndTheme();
  }, []);

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

  const delayAndRefreshData = (ms) =>
    new Promise(() => setTimeout(refreshData, ms));

  const refreshData = () => {
    Router.replace(`/${pageName}`, undefined, { scroll: false });
  };

  const handleCurrencyAndTheme = async (newSettings) => {
    const settingsAndUser = {
      user: getCookie("ue"),
      newSettings: newSettings,
    };
    setAppSettingsInUse(newSettings);
    const res = await updateCurrencyOrThemeSettings(settingsAndUser);
    console.log(res);
    mutate("http://localhost:3000/api/v1/appSettings");
    delayAndRefreshData(500);
  };

  return (
    <>
      <motion.div
        className={styles.split}
        whileTap={{ scale: 0.5 }}
        whileHover={{ scale: 1.1 }}
        onClick={showModal}
      >
        {appSettingsInUse.theme === "dark" ? (
          <>
            <div
              className={styles.left}
              style={{
                backgroundImage:
                  "url(" +
                  `/${appSettingsInUse.currencyCode}FlagLarge.jpg` +
                  ")",
                borderColor: "white",
              }}
            ></div>
            <div className={styles.right}>
              <Moon size={16} />
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.left}
              style={{
                backgroundImage:
                  "url(" +
                  `/${appSettingsInUse.currencyCode}FlagLarge.jpg` +
                  ")",
                borderColor: "dimgrey",
              }}
            ></div>
            <div className={styles.right}>
              <Sun size={16} />
            </div>
          </>
        )}
      </motion.div>
      {isShown ? (
        <SettingsModalContainer
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleCurrencyAndTheme}
          title={"app settings"}
          currentSettings={appSettingsInUse}
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default SettingsLink;
