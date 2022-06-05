import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import AuthButton from "./auth-button";
import {
  setCookies,
  removeCookies,
  getCookie,
  checkCookies,
} from "cookies-next";
import Router from "next/router";
import { mutate } from "swr";
import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import {
  deleteAccount,
  getPortfolios,
  setCurrentPortfolioNumber,
} from "../actions";
import { motion } from "framer-motion";
import styles from "./header.module.scss";
import toast from "react-hot-toast";
import BurgerMenu from "./burger-menu";
import PortfoliosModalContainer from "./portfolios-modal-container";

const Header = (props) => {
  const [user, setUser] = useContext(UserContext);
  const loginButton = props.authButtons[0];
  const [portfolioName, setPortfolioName] = useState("main");
  const [userPortfolios, setUserPortfolios] = useState();
  const [isShown, setIsShown] = useState(false);
  const [colour, setColour] = useState("red");

  useEffect(() => {
    setPortfolioName(getCookie("pnm"));
    setColour(getCookie("pc"));
  }, [getCookie("pnm"), getCookie("pc")]);

  useEffect(() => {
    const getUserPortfolios = async () => {
      const res = await getPortfolios({ userNumber: getCookie("un") });
      setUserPortfolios(res);
    };
    if (checkCookies("un")) {
      getUserPortfolios();
    }
  }, [getCookie("un")]);

  const showModal = async () => {
    const res = await getPortfolios({ userNumber: getCookie("un") });
    setUserPortfolios(res);
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

  const handlePortfolioSwitch = async (portfolio) => {
    toast.error(`switching to ${portfolio.portfolioName}: please wait...`, {
      id: "portfolioSwitchFromHeader",
    });
    setCookies("pn", portfolio.portfolioNumber);
    setCookies("pnm", portfolio.portfolioName);
    setCookies("pc", portfolio.colour);
    await setCurrentPortfolioNumber({
      userNumber: portfolio.userNumber,
      newSettings: { currentPortfolioNumber: portfolio.portfolioNumber },
    });
    const currentPage = Router.pathname;
    Router.replace(currentPage, undefined, { scroll: false });
  };

  const logout = async (doDelete) => {
    if (doDelete) {
      const res = await deleteAccount(getCookie("un"));
      console.log(res);
    }

    magic.user.logout().then(() => {
      setUser({ user: null });
      // set defaultUser to access default theme when not logged in
      setCookies("un", 0);
      setCookies("pc", "red");
      removeCookies("cc");
      removeCookies("pn");
      removeCookies("pnm");
      navigateToLogin();
      mutate("http://localhost:3000/api/v1/appSettings");
    });
  };

  const navigateToLogin = () => {
    Router.push("/login");
  };

  const topLevelPages = [
    "/",
    "/ledger",
    "/pocket",
    "/monitor",
    "/portfolios",
    "/settings",
  ];

  return (
    <>
      <div
        className={styles.Header}
        style={{
          backgroundImage: `linear-gradient(to right, red, red, red, ${colour})`,
        }}
      >
        <div className={styles.hidden}>placeholder</div>
        <Link href="/">
          <motion.div
            className={styles.AppTitle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.5 }}
          >
            {props.appTitle}
          </motion.div>
        </Link>
        {user?.issuer && !user?.loading ? (
          <>
            <BurgerMenu logout={logout} />{" "}
            {topLevelPages.includes(Router.pathname) && (
              <motion.div
                className={styles.Portfolio}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.5 }}
                onClick={showModal}
              >
                {portfolioName}
              </motion.div>
            )}
          </>
        ) : null}
        {!user?.issuer && !user?.loading ? (
          <AuthButton
            auth={navigateToLogin}
            key={loginButton.path}
            path={loginButton.path}
            label={loginButton.label}
          />
        ) : null}
      </div>
      {isShown ? (
        <PortfoliosModalContainer
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handlePortfolioSwitch}
          title={"select portfolio"}
          data={userPortfolios}
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default Header;
