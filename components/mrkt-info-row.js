import React, { useContext } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import styles from "./mrktInfoRow.module.scss";
import { ArrowUp, ArrowDown } from "react-feather";

const MrktInfoRow = (props) => {
  const {
    key1,
    value1,
    key2,
    value2,
    withArrow,
    percentage,
    withAppCurrencySign,
  } = props;
  const { appCurrencySign } = useContext(CurrencySettingsContext);

  return (
    <div className={styles.mrktInfoLayout}>
      <div className={styles.infoCellLeft}>{key1}</div>
      <div
        className={
          styles.infoCellRight +
          " " +
          `${withArrow ? (Number(value2) < 0 ? styles.red : styles.green) : ""}`
        }
      >
        {withAppCurrencySign ? appCurrencySign : ""}
        {value1}
        {withArrow ? (
          Number(value2) < 0 ? (
            <ArrowDown size={16} />
          ) : (
            <ArrowUp size={16} />
          )
        ) : (
          ""
        )}
      </div>
      <div className={styles.infoCellLeft}>{key2}</div>
      <div
        className={
          styles.infoCellRight +
          " " +
          `${withArrow ? (Number(value2) < 0 ? styles.red : styles.green) : ""}`
        }
      >
        {value2}
        {percentage ? "%" : ""}
        {withArrow ? (
          Number(value2) < 0 ? (
            <ArrowDown size={16} />
          ) : (
            <ArrowUp size={16} />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default MrktInfoRow;
