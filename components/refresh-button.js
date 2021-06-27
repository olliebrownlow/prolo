import Router from "next/router";
import React from "react";
import { RefreshCw } from "react-feather";
import styles from "./button.module.scss";

const RefreshButton = () => {
  return (
    <>
      <div className={styles.title}>hit refresh to confirm:</div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={() => Router.reload()}>
          refresh
          <span className={styles.logo}>
            <RefreshCw size={14} />
          </span>
        </button>
      </div>
    </>
  );
};

export default RefreshButton;
