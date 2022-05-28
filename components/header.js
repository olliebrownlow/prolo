import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import AuthButton from "./auth-button";
import { setCookies, removeCookies, getCookie } from "cookies-next";
import Router from "next/router";
import { mutate } from "swr";
import { magic } from "../lib/magic";
import { UserContext } from "../lib/UserContext";
import { deleteAccount } from "../actions";
import { motion } from "framer-motion";
import styles from "./header.module.scss";
import BurgerMenu from "./burger-menu";

const Header = (props) => {
  const [user, setUser] = useContext(UserContext);
  const loginButton = props.authButtons[0];
  const [portfolioName, setPortfolioName] = useState("main");
  const [colour, setColour] = useState("red");

  useEffect(() => {
    setPortfolioName(getCookie("pnm"));
    setColour(getCookie("pc"));
  }, [getCookie("pnm"), getCookie("pc")]);

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

  return (
    <div
      className={styles.Header}
      style={{ backgroundImage: `linear-gradient(to right, red, red, ${colour})` }}
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
          <Link href="/portfolios">
            <motion.div
              className={styles.Portfolio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.5 }}
            >
              {portfolioName}
            </motion.div>
          </Link>{" "}
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
  );
};

export default Header;
