import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "react-feather";
import styles from "./pocketBalance.module.scss";
import { calculateBalance } from "../lib/core/calculateBalance";

const PocketBalance = (props) => {
  const { roundTo2DP, coinData, fiatData, appCurrencySign } = props;
  const [balance, setBalance] = useState(0.5);

  useEffect(async () => {
    const balance = await calculateBalance(coinData, fiatData);

    setBalance(balance);
  }, [coinData, fiatData]);

  return (
    <>
      <Link href="/pocket" scroll={false}>
        <div className={styles.pocketBalance}>
          {appCurrencySign}
          {roundTo2DP(balance)} <RefreshCw />
        </div>
      </Link>
      <hr className={styles.solidDivider} />
    </>
  );
};

export default PocketBalance;
