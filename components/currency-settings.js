import styles from "./currencySettings.module.scss";
import SettingButton from "./setting-button";
import { currencyButtons } from "../config/appSettingsButtons";

const CurrencySettings = ({ currencyInUseCode, handleCurrency }) => {
  return (
    <>
      <div className={styles.title}>currency</div>
      <div className={styles.buttons}>
        {currencyButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${currencyInUseCode === button.label ? styles.active : ""}`
            }
            key={button.label}
            name={button.label}
            sign={button.sign}
            value={button.value}
            label={currencyInUseCode === button.label ? null : button.label}
            onClick={handleCurrency}
            style={
              currencyInUseCode === button.label
                ? { backgroundImage: `url(${button.label}FlagLarge.jpg)` }
                : {}
            }
          />
        ))}
      </div>
    </>
  );
};

export default CurrencySettings;
