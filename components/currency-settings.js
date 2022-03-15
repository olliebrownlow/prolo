import styles from "./currencySettings.module.scss";
import SettingButton from "./setting-button";

const CurrencySettings = (props) => {
  return (
    <>
      <div className={styles.title}>currency:</div>
      <div className={styles.buttons}>
        {props.currencyButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${
                props.currencyInUseCode === button.label
                  ? styles.active
                  : ""
              }`
            }
            key={button.label}
            name={button.label}
            sign={button.sign}
            value={button.value}
            label={
              props.currencyInUseCode === button.label
                ? null
                : button.label
            }
            onClick={props.handleCurrency}
            style={
              props.currencyInUseCode === button.label
                ? { backgroundImage: `url(${button.label}FlagSmall.jpg)` }
                : {}
            }
          />
        ))}
      </div>
    </>
  );
};

export default CurrencySettings;
