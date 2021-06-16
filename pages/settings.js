import { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import React from "react";
import CurrencySettings from "../components/currency-settings";
import ThemeSettings from "../components/theme-settings";
import RefreshButton from "../components/refresh-button"
import styles from "../pageStyles/settings.module.scss";
import {
  getCurrencySettings,
  updateCurrencySettings,
  getThemeSettings,
  updateThemeSettings,
} from "../actions/index";

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
    const newCurrency = [
      {
        currencyCode: code,
        currencyName: name,
      },
    ];

    setCurrencyInUse(newCurrency);
    handleUpdateCurrency(newCurrency);
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
            <RefreshButton />
          </div>
        )
      )}
    </>
  );
};

Settings.getInitialProps = async () => {
  const currency = await getCurrencySettings();
  const theme = await getThemeSettings();
  return { currency, theme };
};

export default Settings;
