import styles from "./coinList.module.scss";
import { Edit3 } from "react-feather";

const CoinList = (props) => {
  const { coinData, convertedBalanceData, settingsCurrencySign } = props;

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

  const roundTo2DP = (unrounded) => {
    return (Math.round(unrounded * 100) / 100).toFixed(2);
  };

  return (
    <>
      <div className={styles.coinList}>
        <img
          className={styles.currencyImg}
          src={`./${coinData[0].currencyInUse}Flag.jpg`}
          alt={coinData[0].currencyInUse}
        />
        <div className={styles.heading}>balance</div>
        <div className={styles.balance}>
          {settingsCurrencySign}
          {balance()}
        </div>
        <div className={styles.heading}>coin holdings</div>
        {coinData.map((coin) => (
          <div key={coin.id}>
            <ul className={styles.coinListRow}>
              <li className={styles.coinLogoContainer}>
                <img
                  className={styles.coinLogo}
                  src={coin.logo_url}
                  alt={coin.name}
                />
              </li>
              <li className={styles.coinName}>
                {coin.name}
                <div className={styles.coinAmount}>
                  {settingsCurrencySign}
                  {parseFloat(+coin.price).toPrecision(10)}
                </div>
              </li>
              <li className={styles.totalValue}>
                {settingsCurrencySign}
                {parseFloat(coin.total).toPrecision(10)}
                <div className={styles.coinAmount}>{coin.amount}</div>
              </li>
              <li className={styles.editIcon}>
                <Edit3 />
              </li>
            </ul>
          </div>
        ))}
        <div className={styles.heading}>fiat holdings</div>
        {convertedBalanceData.map((fiatData) => (
          <div key={fiatData.id}>
            <ul className={styles.coinListRow}>
              <li className={styles.coinLogoContainer}>
                <img
                  className={styles.coinLogo}
                  src={`./${fiatData.from.toLowerCase()}Flag.jpg`}
                  alt={fiatData.from}
                />
              </li>
              <li className={styles.coinName}>
                {fiatData.fullFiatName}
                <div className={styles.hidden}>
                  placeholder
                </div>
              </li>
              <li className={styles.totalValue}>
                {fiatData.fiatSign}
                {fiatData.amount}
                <div className={styles.coinAmount}>
                  {settingsCurrencySign}
                  {roundTo2DP(fiatData.value)}
                </div>
              </li>
              <li className={styles.editIcon}>
                <Edit3 />
              </li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default CoinList;
