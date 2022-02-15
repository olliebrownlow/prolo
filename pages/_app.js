import { useState, useEffect } from "react";
import { UserContext } from "../lib/UserContext";
import { setCookies, removeCookies, checkCookies } from "cookies-next";
import { Toaster } from "react-hot-toast";
import { AlertTriangle } from "react-feather";
import CurrencySettingsContext from "../context/currencySettings";
import Router from "next/router";
import Head from "next/head";
import Header from "../components/header";
import NavBar from "../components/nav-bar";
import navButtons from "../config/navButtons";
import authButtons from "../config/authButtons";
import currencyButtons from "../config/currencyButtons";
import themeButtons from "../config/themeButtons";
import { magic } from "../lib/magic";
import useSWR from "swr";
import axios from "axios";

import "../pageStyles/index.scss";
import "../pageStyles/appLayout.scss";

const fetcher = async (url) => {
  const res = await axios.get(url);
  return res;
};

function Prolo({ Component, pageProps }) {
  const [user, setUser] = useState();
  const [appTheme, setAppTheme] = useState("light");
  const [appCurrencySign, setAppCurrencySign] = useState("€");
  const [appCurrencyCode, setAppCurrencyCode] = useState("eur");
  const [appCurrencyName, setAppCurrencyName] = useState("euros");
  const appTitle = `pro.lo-`;

  const BASE_URL = "http://localhost:3000";

  const { data: themeSettings, error: themeSettingsError } = useSWR(
    `${BASE_URL}/api/v1/themeSettings`,
    fetcher
  );

  const { data: currencySettings, error: currencySettingsError } = useSWR(
    `${BASE_URL}/api/v1/currencySettings`,
    fetcher
  );

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => {
          setUser(userData);
          setCookies("ue", userData.email);
        });
      } else {
        Router.push("/login");
        setUser({ user: null });
        if (checkCookies("ue")) {
          removeCookies("ue");
        }
      }
    });
  }, []);

  useEffect(async () => {
    if (themeSettings) {
      setAppTheme(themeSettings.data[0].theme);
    }
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
      appTheme === "light" ? "dimgrey" : "#ffffff"
    );
    root?.style.setProperty(
      "--border",
      appTheme === "light" ? "#000000" : "#ffffff"
    );
    root?.style.setProperty(
      "--border-top",
      appTheme === "light" ? "#000000" : "#ffffff"
    );
  }, [themeSettings, appTheme]);

  useEffect(async () => {
    if (currencySettings) {
      setAppCurrencySign(currencySettings.data[0].sign);
      setAppCurrencyCode(currencySettings.data[0].currencyCode);
      setAppCurrencyName(currencySettings.data[0].currencyName);
    }
  }, [currencySettings, appCurrencySign, appCurrencyCode, appCurrencyName]);

  const roundTo2DP = (unrounded) => {
    return (Math.round(unrounded * 100) / 100).toFixed(2);
  };

  return (
    <UserContext.Provider value={[user, setUser]}>
      <CurrencySettingsContext.Provider
        value={{
          appCurrencySign: appCurrencySign,
          appCurrencyCode: appCurrencyCode,
          appCurrencyName: appCurrencyName,
        }}
      >
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
              roundTo2DP={roundTo2DP}
            />
          </div>
          <Toaster
            toastOptions={{
              style: {
                textAlign: "center",
                fontSize: "20px",
              },
              error: {
                icon: <AlertTriangle color="red" size="30px" />,
              },
            }}
          />
          <div className="Footer">
            <NavBar navButtons={navButtons} />
          </div>
        </div>
      </CurrencySettingsContext.Provider>
    </UserContext.Provider>
  );
}

export default Prolo;
