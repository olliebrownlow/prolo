import styles from "./currencySettings.module.scss";
import CurrencyButton from "./currency-button";

const CurrencySettings = (props) => {
  return (
    <>
      <div className={styles.title}>currency:</div>
      <div className={styles.buttons}>
        {props.currencyButtons.map((button) => (
          <CurrencyButton
            className={
              styles.button +
              " " +
              `${
                props.currencyInUse[0].currencyCode === button.label
                  ? styles.active
                  : ""
              }`
            }
            key={button.label}
            name={button.label}
            sign={button.sign}
            value={button.value}
            label={
              props.currencyInUse[0].currencyCode === button.label
                ? null
                : button.label
            }
            onClick={props.handleCurrency}
            style={
              props.currencyInUse[0].currencyCode === button.label
                ? { backgroundImage: `url(${button.label}Flag.jpg)` }
                : {}
            }
          />
        ))}
      </div>
    </>
  );
};

export default CurrencySettings;
