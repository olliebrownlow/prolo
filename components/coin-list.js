import styles from "./listing.module.scss";
import Link from "next/link";
import { Edit2, Edit3 } from "react-feather";

const CoinList = (props) => {
  const { roundTo2DP, coinData, settingsCurrencySign } = props;

  return (
    <>
      {coinData.map((coin) => (
        <div key={coin.id}>
          <Link
            href={{
              pathname: "/coins/[id]",
              query: {
                id: coin.id,
                name: coin.name,
                logo_url: coin.logo_url,
                amount: coin.amount,
                total: coin.total,
                price: coin.price,
                currencyInUse: coin.currencyInUse,
                settingsCurrencySign: settingsCurrencySign,
              },
            }}
          >
            <ul className={styles.listRow}>
              <li className={styles.logoContainer}>
                <img
                  className={
                    styles.logo +
                    " " +
                    `${coin.name === "polkadot" ? styles.withBackground : ""}`
                  }
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
                <Edit2 />
              </li>
            </ul>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CoinList;
