import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "react-feather";

const CoinList = (props) => {
  const { roundTo2DP, coinData, appCurrencySign } = props;

  // when user has no coins, an
  // empty array must be returned for
  // reliable mapping.
  const emptyOrOrderedArray = () => {
    if (coinData[0].total) {
      return coinData.sort((a, b) => b.total - a.total);
    } else {
      return [];
    }
  };

  return (
    <>
      {emptyOrOrderedArray().map((coin) => (
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
                high: coin.high,
                highDate: coin.highDate,
                supply: coin.supply,
                maxSupply: coin.maxSupply,
                appCurrencySign: appCurrencySign,
              },
            }}
          >
            <div className={styles.listRow}>
              <li className={styles.logoContainer}>
                <div
                  className={`${
                    coin.name === "polkadot" ? styles.withBackground : ""
                  }`}
                >
                  <Image
                    src={coin.logo_url}
                    alt={coin.name}
                    layout="fill"
                    priority
                  />
                </div>
              </li>
              <li className={styles.name}>
                {coin.name}
                <div className={styles.amount}>{coin.amount}</div>
              </li>
              <li className={styles.totalValue}>
                {appCurrencySign}
                {roundTo2DP(coin.total)}
                <div className={styles.amount}>
                  {appCurrencySign}
                  {roundTo2DP(+coin.price)}
                </div>
              </li>
              <li className={styles.editIcon}>
                <ArrowUpRight size={32} />
              </li>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CoinList;
