import styles from "./pocketBalance.module.scss";

const PocketBalance = (props) => {
  const {
    roundTo2DP,
    coinData,
    convertedBalanceData,
    settingsCurrencySign,
  } = props;

  const balance = () => {
    const unrounded =
      coinData.reduce(function (prev, next) {
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
      {balance()}
    </div>
  );
};

export default PocketBalance;
