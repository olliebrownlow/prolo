import { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import React from "react";
import Router from "next/router";
import CurrencyButton from "../components/currency-button";
import styles from "../pageStyles/settings.module.scss";
import { getSettings, updateCurrency } from "../actions/index";

const Settings = (props) => {
  const [user] = useContext(UserContext);
  const { currency } = props;
  const [currencyInUse, setCurrencyInUse] = useState(currency);

  const handleUpdateCurrency = (currency) => {
    updateCurrency(currency);
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
            <div className={styles.title}>preferred app currency:</div>
            <div className={styles.buttons}>
              {props.currencyButtons.map((button) => (
                <CurrencyButton
                  className={
                    styles.button +
                    " " +
                    `${
                      currencyInUse[0].currencyCode === button.label
                        ? styles.active
                        : ""
                    }`
                  }
                  key={button.label}
                  name={button.label}
                  value={button.value}
                  label={
                    currencyInUse[0].currencyCode === button.label
                      ? null
                      : button.label
                  }
                  onClick={handleCurrency}
                  style={
                    currencyInUse[0].currencyCode === button.label
                      ? { backgroundImage: `url(${button.label}Flag.jpg)` }
                      : {}
                  }
                />
              ))}
            </div>
            <div className={styles.title}>
              current setting: {currencyInUse[0].currencyName}
            </div>
          </div>
        )
      )}
    </>
  );
};

Settings.getInitialProps = async () => {
  const currency = await getSettings();
  return { currency };
};

export default Settings;
