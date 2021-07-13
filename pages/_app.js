import { useState, useEffect } from "react";
import { UserContext } from "../lib/UserContext";
import App from "next/app";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";
import NavBar from "../components/nav-bar";
import navButtons from "../config/navButtons";
import authButtons from "../config/authButtons";
import currencyButtons from "../config/currencyButtons";
import themeButtons from "../config/themeButtons";
import { magic } from "../lib/magic";
import { getThemeSettings } from "../actions";

import "../pageStyles/index.scss";
import "../pageStyles/appLayout.scss";

function Prolo({ Component, pageProps }) {
  const [user, setUser] = useState();
  const [appTheme, setAppTheme] = useState();
  const appTitle = `pro.lo-`;

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => setUser(userData));
      } else {
        Router.push("/login");
        setUser({ user: null });
      }
    });
  }, []);

  useEffect(async () => {
    const theme = await getThemeSettings();
    setAppTheme(theme[0].theme);

    const root = document.documentElement;
    root?.style.setProperty(
      "--background-color",
      appTheme === "dark" ? "#000000" : "#ffffff"
    );
    root?.style.setProperty(
      "--background",
      appTheme === "dark" ? "#000000" : "#ffffff"
    );
    root?.style.setProperty(
      "--color",
      appTheme === "light" ? "#000000" : "#ffffff"
    );
    root?.style.setProperty(
      "--border",
      appTheme === "light" ? "#000000" : "#ffffff"
    );
    root?.style.setProperty(
      "--border-top",
      appTheme === "light" ? "#000000" : "#ffffff"
    );
  }, [appTheme]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="Layout">
        <Head>
          <title>pro.lo- cryptocurrency profit/loss tracker</title>
          <link rel="icon" href="/prolo_black_symbolWhite_logo.png" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
        </Head>
        <div className="Header">
          <Header appTitle={appTitle} authButtons={authButtons} />
        </div>
        <div className="Content">
          <Component
            {...pageProps}
            currencyButtons={currencyButtons}
            themeButtons={themeButtons}
          />
        </div>
        <div className="Footer">
          <NavBar navButtons={navButtons} />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default Prolo;
