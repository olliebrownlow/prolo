import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "react-feather";
import styles from "./pocketBalance.module.scss";
import { calculateBalance } from "../lib/core/calculateBalance";

const PocketBalance = (props) => {
  const { roundTo2DP, coinData, fiatData, appCurrencySign } = props;
  const [balance, setBalance] = useState(0.5);
  const [anim, setAnim] = useState(0);

  useEffect(async () => {
    const balance = await calculateBalance(coinData, fiatData);

    setBalance(balance);
  }, [coinData, fiatData]);

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
