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
import { magic } from "../lib/magic";

import "../pageStyles/index.scss";
import "../pageStyles/appLayout.scss";

function Prolo({ Component, pageProps }) {
  const [user, setUser] = useState();
  const appTitle = `pro.lo-`;

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => setUser(userData));
      } else {
        // Router.push("/login");
        setUser({ user: null });
      }
    });
  }, []);

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
        <Header appTitle={appTitle} authButtons={authButtons} />
        <div className="Content">
          <Component
            {...pageProps}
            currencyButtons={currencyButtons}
          />
        </div>
        <NavBar navButtons={navButtons} />
      </div>
    </UserContext.Provider>
  );
}

Prolo.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default Prolo;
