import React from "react";
import { Tool } from "react-feather";
import styles from "./button.module.scss";
import { motion } from "framer-motion";

const CustomiseButton = (props) => {
  const { buttonText, showModal, isShown } = props;

  return (
    <>
      <div className={styles.buttons}>
        <motion.button
          className={styles.orderByButton}
          onClick={showModal}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={isShown ? { scale: [1, 0.5, 1] } : {}}
        >
          {buttonText}
          <span className={styles.logo}>
            <Tool size={18} />
          </span>
        </motion.button>
      </div>
    </>
  );
};

export default CustomiseButton;
