import React, { useEffect, useState } from "react";
import styles from "./pocketBalance.module.scss";
import { calculateBalance } from "../lib/core/calculateBalance";

const PocketBalance = (props) => {
  const { roundTo2DP, coinData, fiatData, settingsCurrencySign } = props;
  const [balance, setBalance] = useState(0.5);

  useEffect(async () => {
    const balance = await calculateBalance(coinData, fiatData);

    setBalance(balance);
  }, [coinData, fiatData]);

  return (
    <>
      <div className={styles.pocketBalance}>
        {settingsCurrencySign}
        {roundTo2DP(balance)}
      </div>
      <hr className={styles.solidDivider} />
    </>
  );
};

export default PocketBalance;
