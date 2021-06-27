import styles from "./listing.module.scss";
import { Edit3 } from "react-feather";

const CoinList = (props) => {
  const { roundTo2DP, coinData, settingsCurrencySign } = props;

  return (
    <>
      {coinData.map((coin) => (
        <div key={coin.id}>
          <ul className={styles.listRow}>
            <li className={styles.logoContainer}>
              <img
                className={styles.logo}
                src={coin.logo_url}
                alt={coin.name}
              />
            </li>
            <li className={styles.name}>
              {coin.name}
              <div className={styles.amount}>{coin.amount}</div>
            </li>
            <li className={styles.totalValue}>
              {settingsCurrencySign}
              {roundTo2DP(coin.total)}
              <div className={styles.amount}>
                {settingsCurrencySign}
                {roundTo2DP(+coin.price)}
              </div>
            </li>
            <li className={styles.editIcon}>
              <Edit3 />
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

export default CoinList;
