import React, { useEffect, useState } from "react";
import styles from "./pocketBalance.module.scss";
import { updateBalance } from "../actions";

const PocketBalance = (props) => {
  const {
    roundTo2DP,
    coinData,
    fiatData,
    settingsCurrencySign,
  } = props;
  const [balance, setBalance] = useState(0.5);

  useEffect(() => {
    // when user has no coins, an
    // empty array must be returned for
    // the balance function to reliably reduce,
    // due to the lack of a "total" value.
    const emptyArrayIfNeeded = () => {
      if (coinData[0].total) {
        return coinData;
      } else {
        return [];
      }
    };

    const calculateAndSetBalance = (array) => {
      const unrounded =
        array.reduce(function (prev, next) {
          return prev + next.total;
        }, 0) +
        fiatData.reduce(function (prev, next) {
          return prev + next.value;
        }, 0);

      setBalance(unrounded);
      return unrounded;
    };

    async function handleUpdateBalance() {
      const unroundedBalance = calculateAndSetBalance(emptyArrayIfNeeded());

      const res = await updateBalance([
        {
          code: coinData[0].currencyInUse,
          amount: unroundedBalance,
          sign: settingsCurrencySign,
        },
      ]);
      console.log(res);
    }
    handleUpdateBalance();
  }, [coinData, fiatData, settingsCurrencySign]);

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
