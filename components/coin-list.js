import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "react-feather";

const CoinList = (props) => {
  const { coinData, appCurrencySign } = props;

  const orderedArray = () => {
    return coinData.sort((a, b) => b.total - a.total);
  };

  const selectRoundingMethod = (value) => {
    if (parseFloat(value) < 0.0001) {
      return dPRounder(value, 7);
    }
    if (parseFloat(value) < 0.001) {
      return dPRounder(value, 6);
    }
    if (parseFloat(value) < 0.01) {
      return dPRounder(value, 5);
    }
    if (parseFloat(value) < 0.1) {
      return dPRounder(value, 4);
    }
    if (parseFloat(value) < 1) {
      return dPRounder(value, 3);
    }
    return dPRounder(value, 2);
  };

  const dPRounder = (value, places) => {
    return (Math.round(value * 10 ** places) / 10 ** places).toFixed(places);
  };

  return (
    <>
      {coinData[0].id ? (
        orderedArray().map((coin) => (
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
                  {selectRoundingMethod(coin.total)}
                  <div className={styles.amount}>
                    {appCurrencySign}
                    {selectRoundingMethod(coin.price)}
                  </div>
                </div>
                <div className={styles.editIcon}>
                  <ArrowUpRight size={32} />
                </div>
              </motion.div>
            </Link>
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
};

export default CoinList;
