import React from "react";
import { motion } from "framer-motion";
import styles from "./interval.module.scss";

const intervalOptions = ["hour", "day", "week", "month", "year", "ytd"];

const Interval = ({ currentIndex, onChange }) => {
  return (
    <>
      <div className={styles.intervalSelectionHeading}>interval selection</div>
      <div className={styles.intervalContainer}>
        {intervalOptions.map((interval, index) => {
          let color = currentIndex === index ? "" : "grey";
          let fontSize = currentIndex === index ? "18px" : "14px";
          let fontWeight = currentIndex === index ? "900" : "100";
          return (
            <motion.div
              key={index}
              onClick={() => onChange(index)}
              whileHover={{ scale: 1.1 }}
              // transition={{ duration: 0.25 }}
              // animate={{ scale: [1, 0.5, 1] }}
              whileTap={{ scale: 0.5 }}
              style={{
                color: color,
                fontSize: fontSize,
                fontWeight: fontWeight,
              }}
            >
              {interval}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default Interval;
