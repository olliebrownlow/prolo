import styles from "./customiseMonitorForm.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import SettingButton from "./setting-button";
import {
  metricOneButtons,
  metricTwoButtons,
  orderByButtons,
  directionButtons,
} from "../config/customiseMonitorButtons";
import AddButton from "./add-button";
import { HelpCircle } from "react-feather";
import Tooltip from "react-tooltip";

const CustomiseMonitorForm = (props) => {
  const { title, currentSettings, handleFormSubmit, closeModal } = props;

  const [settings, setSettings] = useState(currentSettings);
  const [isShown, setIsShown] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    const target = event.target;
    setSettings({
      ...settings,
      [target.name]: target.value,
    });
    console.log(settings);
  };

  const delayAndCloseModal = (ms) =>
    new Promise(() => setTimeout(closeModal, ms));

  const submitSettings = async () => {
    if (
      currentSettings.directionMonitor === settings.directionMonitor &&
      currentSettings.orderByMonitor === settings.orderByMonitor &&
      currentSettings.metricOneMonitor === settings.metricOneMonitor &&
      currentSettings.metricTwoMonitor === settings.metricTwoMonitor
    ) {
      toast.error("no settings changed: please make a change or cancel", {
        id: "noNewSettings",
      });
    } else {
      setIsButtonDisabled(true);
      setIsShown(true);
      handleFormSubmit({ ...settings });
      await delayAndCloseModal(500);
      setIsButtonDisabled(false);
      setIsShown(false);
    }
  };

  return (
    <>
      <Tooltip html={true} globalEventOff="click" />
      <h1 className={styles.heading}>{title}</h1>
      <hr className={styles.solidDivider} />
      <h1 className={styles.subheading}>
        metric one
        <sup
          data-tip="
            <img
              style='height:125px;width:300px;border-color:white;'
              src='./metric1-600x248.gif'
              alt='grey element below coin name'
            />
          "
          data-event="click"
          data-background-color="none"
        >
          <HelpCircle
            className={styles.helpCircle}
            size={14}
            color={"lightsteelblue"}
          />
        </sup>
      </h1>
      <div className={styles.buttons}>
        {metricOneButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${
                settings.metricOneMonitor === button.value ? styles.active : ""
              }`
            }
            key={button.value}
            name={button.name}
            value={button.value}
            label={button.label}
            onClick={handleChange}
          />
        ))}
      </div>
      <h1 className={styles.subheading}>
        metric two
        <sup
          data-tip="
            <img
              style='height:125px;width:300px;border-color:white;'
              src='./metric2-600x249.gif'
              alt='grey element below coin price'
            />
          "
          data-event="click"
          data-background-color="none"
        >
          <HelpCircle
            className={styles.helpCircle}
            size={14}
            color={"lightsteelblue"}
          />
        </sup>
      </h1>
      <div className={styles.buttons}>
        {metricTwoButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${
                settings.metricTwoMonitor === button.value ? styles.active : ""
              }`
            }
            key={button.value}
            name={button.name}
            value={button.value}
            label={button.label}
            onClick={handleChange}
          />
        ))}
      </div>
      <h1 className={styles.subheading}>order by</h1>
      <div className={styles.dirButtons}>
        {orderByButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${settings.orderByMonitor === button.value ? styles.active : ""}`
            }
            key={button.value}
            name={button.name}
            value={button.value}
            label={button.value}
            onClick={handleChange}
          />
        ))}
      </div>
      <h1 className={styles.subheading}>direction</h1>
      <div className={styles.dirButtons}>
        {directionButtons.map((button) => (
          <SettingButton
            className={
              styles.button +
              " " +
              `${
                settings.directionMonitor === button.value ? styles.active : ""
              }`
            }
            key={button.value}
            name={button.name}
            value={button.value}
            label={button.value}
            onClick={handleChange}
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

export default CustomiseMonitorForm;
