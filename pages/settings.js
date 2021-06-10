import { useContext, useState } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import CurrencyButton from "../components/currency-button";
import styles from "../pageStyles/settings.module.scss";

const Settings = (props) => {
  const [user] = useContext(UserContext);
  const [currency, setCurrency] = useState("");

  const handleCurrency = (event) => {
    const target = event.target;
    setCurrency(target.value);
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
                    `${currency === button.value ? styles.active : ""}`
                  }
                  key={button.label}
                  value={button.value}
                  label={currency === button.value ? null : button.label}
                  onClick={handleCurrency}
                  style={
                    currency === button.value
                      ? { backgroundImage: `url(${button.label}Flag.jpg)` }
                      : {}
                  }
                />
              ))}
            </div>
            <div className={styles.title}>current setting: {currency}</div>
          </div>
        )
      )}
    </>
  );
};

export default Settings;
