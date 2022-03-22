import styles from "./settingsForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import SettingButton from "./setting-button";
import { currencyButtons, themeButtons } from "../config/appSettingsButtons";
import AddButton from "./add-button";

const SettingsForm = (props) => {
  const { title, currentSettings, handleFormSubmit, closeModal } = props;

  const [settings, setSettings] = useState(currentSettings);
  const [isShown, setIsShown] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleCurrencyChange = (event) => {
    const target = event.target;
    const code = target.name;
    const name = target.value;
    const sign = event.target.dataset.sign;
    setSettings({
      ...settings,
      currencyCode: code,
      currencyName: name,
      sign: sign,
    });
  };

  const handleThemeChange = (event) => {
    const target = event.target;
    setSettings({
      ...settings,
      theme: target.value,
    });
  };

  const delayAndCloseModal = (ms) =>
    new Promise(() => setTimeout(closeModal, ms));

  const submitSettings = async () => {
    if (
      currentSettings.theme === settings.theme &&
      currentSettings.currencyCode === settings.currencyCode
    ) {
      toast.error("no settings changed: please make a change or cancel", {
        id: "noNewThemeOrCurrencySettings",
      });
    } else {
      setIsButtonDisabled(true);
      setIsShown(true);
      handleFormSubmit({ ...settings });
      await delayAndCloseModal(1000);
      setIsButtonDisabled(false);
      setIsShown(false);
    }
  };

  return (
    <>
      <h1 className={styles.heading}>{title}</h1>
      <hr className={styles.solidDivider} />
      <h1 className={styles.subheading}>currency</h1>
      <div className={styles.currencyButtons}>
        {currencyButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${
                settings.currencyCode === button.label
                  ? styles.activeCurrency
                  : ""
              }`
            }
            key={button.label}
            name={button.label}
            sign={button.sign}
            value={button.value}
            label={settings.currencyCode === button.label ? null : button.label}
            onClick={handleCurrencyChange}
            style={
              settings.currencyCode === button.label
                ? { backgroundImage: `url(${button.label}FlagLarge.jpg)` }
                : {}
            }
          />
        ))}
      </div>
      <h1 className={styles.subheading}>theme</h1>
      <div className={styles.themeButtons}>
        {themeButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${settings.theme === button.theme ? "" : styles.inactiveTheme}`
            }
            key={button.theme}
            name={button.theme}
            value={button.theme}
            label={settings.theme === button.theme ? button.icon : button.theme}
            onClick={handleThemeChange}
          />
        ))}
      </div>
      <AddButton
        buttonText={"set"}
        showModal={false}
        showLogo={false}
        submitForm={submitSettings}
        isShown={isShown}
        isButtonDisabled={isButtonDisabled}
        centralisedStyling={false}
      />
    </>
  );
};

export default SettingsForm;
