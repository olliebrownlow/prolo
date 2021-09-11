import { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import React from "react";
import CurrencySettings from "../components/currency-settings";
import ThemeSettings from "../components/theme-settings";
import styles from "../pageStyles/settings.module.scss";
import {
  getCurrencySettings,
  updateCurrencySettings,
  getThemeSettings,
  updateThemeSettings,
} from "../actions/index";
import useSWR, { mutate } from "swr";

const Settings = (props) => {
  const [user] = useContext(UserContext);
  const { currency, theme } = props;
  const [currencyInUse, setCurrencyInUse] = useState(currency);
  const [themeInUse, setThemeInUse] = useState(theme);

  const handleUpdateCurrency = (currency) => {
    updateCurrencySettings(currency);
  };

  const handleCurrency = (event) => {
    const target = event.target;
    const code = target.name;
    const name = target.value;
    const sign = event.target.dataset.sign;
    const newCurrency = [
      {
        currencyCode: code,
        currencyName: name,
        sign: sign,
      },
    ];

    setCurrencyInUse(newCurrency);
    handleUpdateCurrency(newCurrency);
    mutate("http://localhost:3000/api/v1/currencySettings");
  };

  const handleUpdateTheme = (theme) => {
    updateThemeSettings(theme);
  };

  const handleTheme = (event) => {
    const target = event.target;
    const theme = target.name;
    const newTheme = [
      {
        theme: theme,
      },
    ];
    setThemeInUse(newTheme);
    handleUpdateTheme(newTheme);
    mutate("http://localhost:3000/api/v1/themeSettings");
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.settings}>
            <CurrencySettings
              handleCurrency={handleCurrency}
              currencyInUse={currencyInUse}
              currencyButtons={props.currencyButtons}
            />
            <ThemeSettings
              handleTheme={handleTheme}
              themeInUse={themeInUse}
              themeButtons={props.themeButtons}
            />
          </div>
        )
      )}
    </>
  );
};

export async function getStaticProps() {
  const currency = await getCurrencySettings();
  const theme = await getThemeSettings();

  return {
    props: {
      currency,
      theme,
    },
  };
}

export default Settings;
