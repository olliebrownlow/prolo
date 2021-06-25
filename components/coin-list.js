import styles from "./coinList.module.scss";
import { Edit3 } from "react-feather";

const CoinList = (props) => {
  const { coinData, convertedBalanceData } = props;

  const balance = () => {
    const unrounded =
      coinData.reduce(function (prev, next) {
        return prev + next.total;
      }, 0) +
      convertedBalanceData.reduce(function (prev, next) {
        console.log(next.response.value);
        return prev + next.response.value;
      }, 0);
    const rounded = roundTo2DP(unrounded);
    // (Math.round(unrounded * 100) / 100).toFixed(2);

    return rounded;
  };

  const roundTo2DP = (unrounded) => {
    return (Math.round(unrounded * 100) / 100).toFixed(2);
  };

  const fullFiatName = (codeName) => {
    switch (codeName) {
      case (codeName = "GBP"):
        codeName = "british sterling";
        break;
      case (codeName = "EUR"):
        codeName = "euros";
        break;
      case (codeName = "USD"):
        codeName = "american dollar";
        break;
      default:
        "unknown currency";
    }
    return codeName;
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
        <div className={styles.balance}>{balance()}</div>
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
                  {parseFloat(+coin.price).toPrecision(10)}
                </div>
              </li>
              <li className={styles.totalValue}>
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
        {convertedBalanceData.map((fiat) => (
          <div key={fiat.response.from}>
            <ul className={styles.coinListRow}>
              <li className={styles.coinLogoContainer}>
                <img
                  className={styles.coinLogo}
                  src={`./${fiat.response.from.toLowerCase()}Flag.jpg`}
                  alt={fiat.response.from}
                />
              </li>
              <li className={styles.coinName}>
                {fullFiatName(fiat.response.from)}
                <div className={styles.coinAmount}>
                  ({fiat.response.to.toLowerCase()})
                </div>
              </li>
              <li className={styles.totalValue}>
                {fiat.response.amount}
                <div className={styles.coinAmount}>
                  ({roundTo2DP(fiat.response.value)})
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
