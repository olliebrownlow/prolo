import React, { useState } from "react";
import Link from "next/link";
import { RefreshCw } from "react-feather";
import styles from "./pocketBalance.module.scss";

const PocketBalance = (props) => {
  const { roundTo2DP, balance, appCurrencySign } = props;
  const [anim, setAnim] = useState(0);

  return (
    <>
      <Link href="/pocket" scroll={false}>
        <div className={styles.pocketBalance} onClick={() => setAnim(1)}>
          {appCurrencySign}
          {roundTo2DP(balance)}{" "}
          <RefreshCw
            className={styles.refresh}
            onClick={() => setAnim(1)}
            onAnimationEnd={() => setAnim(0)}
            anim={anim}
          />
        </div>
      </Link>
      <hr className={styles.solidDivider} />
    </>
  );
};

export default PocketBalance;
