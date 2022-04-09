import { useState, useEffect } from "react";
import { UserContext } from "../lib/UserContext";
import { setCookies, removeCookies } from "cookies-next";
import { Toaster } from "react-hot-toast";
import { AlertTriangle } from "react-feather";
import CurrencySettingsContext from "../context/currencySettings";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/header";
import NavBar from "../components/nav-bar";
import ErrorBoundary from "../components/error-boundary";
import authButtons from "../config/authButtons";
import { magic } from "../lib/magic";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { addAppSettingsForNewUser, hasAppSettings } from "../actions";

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
  const router = useRouter();

  const BASE_URL = "http://localhost:3000";

  const { data: settings, error: settingsError } = useSWR(
    user ? `${BASE_URL}/api/v1/appSettings` : null,
    fetcher
  );

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === "/pocket" || url === "/ledger") {
        setCookies("ct", "holding");
      }
      if (url === "/monitor") {
        setCookies("ct", "monitoring");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // // If the component is unmounted, unsubscribe
    // // from the event with the `off` method:
    // return () => {
    //   router.events.off("routeChangeStart", handleRouteChange);
    // };
  }, []);

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    const addAppSettingsIfNewUser = async (user) => {
      const res = await hasAppSettings();
      if (res === "false" && user != null) {
        await addAppSettingsForNewUser({ user: user });
        mutate("http://localhost:3000/api/v1/appSettings");
        if (settings) {
          setAppTheme(settings.data.theme);
        }
      }
    };

    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => {
          setUser(userData);
          setCookies("ue", userData.email);
          addAppSettingsIfNewUser(userData.email);
        });
      } else {
        Router.push("/login");
        setUser({ user: null });
        // set defaultUser to access default theme when not logged in
        setCookies("ue", "defaultUser");
        removeCookies("cc");
      }
      mutate("http://localhost:3000/api/v1/appSettings");
    });
  }, []);

  useEffect(async () => {
    if (settings) {
      setAppTheme(settings.data.theme);
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
  }, [settings, appTheme]);

  useEffect(async () => {
    if (settings) {
      setAppCurrencySign(settings.data.sign);
      setAppCurrencyCode(settings.data.currencyCode);
      setAppCurrencyName(settings.data.currencyName);
      setCookies("cc", settings.data.currencyCode);
    }
  }, [settings, appCurrencySign, appCurrencyCode, appCurrencyName]);

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
            <ErrorBoundary>
              <Component {...pageProps} roundTo2DP={roundTo2DP} />
            </ErrorBoundary>
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
            <NavBar />
          </div>
        </div>
      </CurrencySettingsContext.Provider>
    </UserContext.Provider>
  );
}

export default Prolo;
