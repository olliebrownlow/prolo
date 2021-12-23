import React from "react";
import styles from "./interval.module.scss";

const intervalOptions = ["hour", "day", "week", "month", "year", "ytd"];

const Interval = ({ currentIndex, onChange }) => {
  return (
    <div className={styles.intervalContainer}>
      {intervalOptions.map((interval, index) => {
        let color = currentIndex === index ? "" : "grey";
        let fontSize = currentIndex === index ? "16px" : "14px";
        let fontWeight = currentIndex === index ? "900" : "100";
        return (
          <div onClick={() => onChange(index)}>
            <div
              style={{
                color: color,
                fontSize: fontSize,
                fontWeight: fontWeight
              }}
            >
              {interval}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Interval;
