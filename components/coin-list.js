import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "react-feather";

const CoinList = (props) => {
  const { roundTo2DP, coinData, appCurrencySign } = props;

  // when user has no coins, an
  // empty array must be returned for
  // reliable mapping.
  const emptyOrOrderedArray = () => {
    if (coinData.length) {
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
              },
            }}
          >
            <motion.div
              className={styles.listRow}
              whileTap={{ scale: 0.8 }}
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              whileHover={{ scale: 1.2 }}
            >
              <div className={styles.logoContainer}>
                <Image
                  className={`${
                    coin.name === "polkadot" || coin.name === "fantom"
                      ? styles.withBackground
                      : ""
                  }`}
                  src={coin.logo_url}
                  alt={coin.name}
                  layout="fill"
                  priority
                />
              </div>
              <div className={styles.name}>
                {coin.name}
                <div className={styles.amount}>{coin.amount}</div>
              </div>
              <div className={styles.totalValue}>
                {appCurrencySign}
                {roundTo2DP(coin.total)}
                <div className={styles.amount}>
                  {appCurrencySign}
                  {roundTo2DP(+coin.price)}
                </div>
              </div>
              <div className={styles.editIcon}>
                <ArrowUpRight size={32} />
              </div>
            </motion.div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CoinList;
