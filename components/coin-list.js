import styles from "./coinList.module.scss";
import { Edit3 } from "react-feather";

const CoinList = (props) => {
  const { coinData } = props;

  return (
    <>
      <div className={styles.coinList}>
        <img
          className={styles.currencyImg}
          src={`./${coinData[0].currencyInUse}Flag.jpg`}
          alt={coinData[0].currencyInUse}
        />
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
                <div className={styles.coinAmount}>{parseFloat(+coin.price).toPrecision(10)}</div>
              </li>
              <li className={styles.totalValue}>
                {parseFloat(+coin.amount * +coin.price).toPrecision(10)}
                <div className={styles.coinAmount}>{coin.amount}</div>
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
