import styles from "./coinList.module.scss";
import { Edit3 } from "react-feather";

const CoinList = (props) => {
  const { coinData, fiatData } = props;

  const balance = () => {
    const unrounded =
      coinData.reduce(function (prev, next) {
        return prev + next.total;
      }, 0) +
      fiatData.reduce(function (prev, next) {
        console.log(next);
        return prev + next.amount;
      }, 0);
    const rounded = (Math.round(unrounded * 100) / 100).toFixed(2);

    return rounded;
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
        {fiatData.map((fiat) => (
          <div key={fiat.fiatCode}>
            <ul className={styles.coinListRow}>
              <li className={styles.coinLogoContainer}>
                <img
                  className={styles.coinLogo}
                  src={`./${fiat.fiatCode}Flag.jpg`}
                  alt={fiat.fiatName}
                />
              </li>
              <li className={styles.coinName}>
                {fiat.fiatName}
                <div className={styles.coinAmount}>{fiat.fiatCode}</div>
              </li>
              <li className={styles.totalValue}>{fiat.amount}</li>
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
