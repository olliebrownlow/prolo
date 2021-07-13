import styles from "./pocketBalance.module.scss";

const PocketBalance = (props) => {
  const {
    roundTo2DP,
    coinData,
    convertedBalanceData,
    settingsCurrencySign,
  } = props;

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

  const balance = (array) => {
    const unrounded =
      array.reduce(function (prev, next) {
        return prev + next.total;
      }, 0) +
      convertedBalanceData.reduce(function (prev, next) {
        return prev + next.value;
      }, 0);
    const rounded = roundTo2DP(unrounded);

    return rounded;
  };

  return (
    <div className={styles.pocketBalance}>
      {settingsCurrencySign}
      {balance(emptyArrayIfNeeded())}
    </div>
  );
};

export default PocketBalance;
