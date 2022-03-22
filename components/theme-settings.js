import styles from "./themeSettings.module.scss";
import SettingButton from "./setting-button";
import { themeButtons } from "../config/appSettingsButtons";

const ThemeSettings = ({ themeInUse, handleTheme }) => {
  return (
    <>
      <div className={styles.title}>theme</div>
      <div className={styles.buttons}>
        {themeButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${themeInUse === button.theme ? "" : styles.inactive}`
            }
            key={button.theme}
            name={button.theme}
            value={button.theme}
            label={button.theme}
            label={themeInUse === button.theme ? button.icon : button.theme}
            onClick={handleTheme}
          />
        ))}
      </div>
    </>
  );
};

export default ThemeSettings;
