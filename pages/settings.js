import React, { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import { getCookie } from "cookies-next";
import Loading from "../components/loading";
import CurrencySettings from "../components/currency-settings";
import ThemeSettings from "../components/theme-settings";
import styles from "../pageStyles/settings.module.scss";
import {
  getCurrencyAndTheme,
  updateCurrencyOrThemeSettings,
} from "../actions/index";
import { mutate } from "swr";

const Settings = (props) => {
  const [user] = useContext(UserContext);
  const { currencyAndTheme } = props;
  const [currencyInUse, setCurrencyInUse] = useState(
    currencyAndTheme.currencyCode
  );
  const [themeInUse, setThemeInUse] = useState(currencyAndTheme.theme);

  const handleCurrency = async (event) => {
    const target = event.target;
    const code = target.name;
    const name = target.value;
    const sign = event.target.dataset.sign;
    const newCurrency = {
      currencyCode: code,
      currencyName: name,
      sign: sign,
    };
    setCurrencyInUse(code);
    await updateCurrencyOrThemeSettings({
      user: user.email,
      newSettings: newCurrency,
    });
    mutate("http://localhost:3000/api/v1/appSettings");
  };

  const handleTheme = async (event) => {
    const target = event.target;
    const theme = target.name;
    if (target.name) {
      const newTheme = {
        theme: theme,
      };
      setThemeInUse(theme);
      await updateCurrencyOrThemeSettings({
        user: user.email,
        newSettings: newTheme,
      });
      mutate("http://localhost:3000/api/v1/appSettings");
    }
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.settings}>
            <div className={styles.heading}>app settings</div>
            <CurrencySettings
              handleCurrency={handleCurrency}
              currencyInUseCode={currencyInUse}
            />
            <ThemeSettings handleTheme={handleTheme} themeInUse={themeInUse} />
          </div>
        )
      )}
    </>
  );
};

export async function getServerSideProps({ req, res }) {
  const user = getCookie("ue", { req, res });
  const currencyAndTheme = await getCurrencyAndTheme(user);
  // console.log(currencyAndTheme);
  return {
    props: {
      currencyAndTheme,
    },
  };
}

export default Settings;
