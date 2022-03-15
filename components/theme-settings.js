import styles from "./themeSettings.module.scss";
import SettingButton from "./setting-button";

const ThemeSettings = (props) => {
  return (
    <>
      <div className={styles.title}>theme:</div>
      <div className={styles.buttons}>
        {props.themeButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${
                props.themeInUse === button.theme ? styles.active : ""
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
