import styles from "./themeSettings.module.scss";
import ThemeButton from "./theme-button";

const ThemeSettings = (props) => {
  return (
    <>
      <div className={styles.title}>theme:</div>
      <div className={styles.buttons}>
        {props.themeButtons.map((button) => (
          <ThemeButton
            className={
              styles.button +
              " " +
              `${
                props.themeInUse[0].theme === button.theme ? styles.active : ""
              }`
            }
            key={button.theme}
            name={button.theme}
            value={button.theme}
            label={button.theme}
            onClick={props.handleTheme}
          />
        ))}
      </div>
    </>
  );
};

export default ThemeSettings;
