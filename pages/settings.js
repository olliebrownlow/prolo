import { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import React from "react";
import Router from "next/router";
import CurrencySettings from "../components/currency-settings";
import styles from "../pageStyles/settings.module.scss";
import { getCurrencySettings, updateCurrencySettings } from "../actions/index";

const Settings = (props) => {
  const [user] = useContext(UserContext);
  const { currency } = props;
  const [currencyInUse, setCurrencyInUse] = useState(currency);

  const handleUpdateCurrency = (currency) => {
    updateCurrencySettings(currency);
  };

  const handleCurrency = (event) => {
    const target = event.target;
    const code = target.name;
    const name = target.value;
    const newState = [
      {
        currencyCode: code,
        currencyName: name,
      },
    ];

    setCurrencyInUse(newState);
    handleUpdateCurrency(newState);
    // .then((updatedCurrency) => {
    //   Router.push("/settings");
    // });
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
          </div>
        )
      )}
    </>
  );
};

Settings.getInitialProps = async () => {
  const currency = await getCurrencySettings();
  return { currency };
};

export default Settings;
