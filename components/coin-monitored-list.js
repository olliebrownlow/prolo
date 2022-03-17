import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import NumberSuffix from "number-suffix";
import { byValue, byString, byNumber } from "sort-es";
import { motion } from "framer-motion";
import { ArrowUpRight } from "react-feather";

const CoinMonitoredList = (props) => {
  const { coinData, currentSettings, appCurrencySign } = props;

  const orderedArray = () => {
    if (currentSettings.directionMonitor === "ascending") {
      return orderedDirArray(false);
    } else {
      return orderedDirArray(true);
    }
  };

  const orderedDirArray = (isDescending) => {
    const orderingMetric = orderMetric(currentSettings.orderByMonitor);
    if (orderingMetric === "name") {
      return coinData.sort(
        byValue((i) => i[orderingMetric], byString({ desc: isDescending }))
      );
    }
    return coinData.sort(
      byValue((i) => i[orderingMetric], byNumber({ desc: isDescending }))
    );
  };

  const orderMetric = (orderByMonitorReading) => {
    if (orderByMonitorReading === "metric one") {
      return currentSettings.metricOneMonitor;
    } else if (orderByMonitorReading === "metric two") {
      return currentSettings.metricTwoMonitor;
    } else {
      return orderByMonitorReading;
    }
  };

  return (
    <div className={styles.listContainer}>
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
                  {currentSettings.metricOneMonitor === "ath" && (
                    <div className={styles.amount}>
                      {appCurrencySign}
                      {coin[currentSettings.metricOneMonitor]}
                    </div>
                  )}
                  {currentSettings.metricOneMonitor === "rank" && (
                    <div className={styles.amount}>
                      {coin[currentSettings.metricOneMonitor]}
                    </div>
                  )}
                  {currentSettings.metricOneMonitor === "mrktCap" && (
                    <div className={styles.amount}>
                      {NumberSuffix.format(
                        Number(coin[currentSettings.metricOneMonitor]),
                        {
                          precision: 2,
                          style: "abbreviation",
                        }
                      )}
                    </div>
                  )}
                  {currentSettings.metricOneMonitor === "pctOfAth" && (
                    <div className={styles.amount}>
                      {coin[currentSettings.metricOneMonitor]}%
                    </div>
                  )}
                  {(currentSettings.metricOneMonitor === "dPricePct" ||
                    currentSettings.metricOneMonitor === "dVolPct") && (
                    <div
                      className={
                        styles.amount +
                        " " +
                        `${
                          Number(coin[currentSettings.metricOneMonitor]) < 0
                            ? styles.red
                            : styles.green
                        }`
                      }
                    >
                      {coin[currentSettings.metricOneMonitor]}%
                    </div>
                  )}
                </div>
                <div className={styles.totalValue}>
                  {appCurrencySign}
                  {coin.price}
                  {currentSettings.metricTwoMonitor === "ath" && (
                    <div className={styles.amount}>
                      {appCurrencySign}
                      {coin[currentSettings.metricTwoMonitor]}
                    </div>
                  )}
                  {currentSettings.metricTwoMonitor === "rank" && (
                    <div className={styles.amount}>
                      {coin[currentSettings.metricTwoMonitor]}
                    </div>
                  )}
                  {currentSettings.metricTwoMonitor === "mrktCap" && (
                    <div className={styles.amount}>
                      {NumberSuffix.format(
                        Number(coin[currentSettings.metricTwoMonitor]),
                        {
                          precision: 2,
                          style: "abbreviation",
                        }
                      )}
                    </div>
                  )}
                  {currentSettings.metricTwoMonitor === "pctOfAth" && (
                    <div className={styles.amount}>
                      {coin[currentSettings.metricTwoMonitor]}%
                    </div>
                  )}
                  {(currentSettings.metricTwoMonitor === "dPricePct" ||
                    currentSettings.metricTwoMonitor === "dVolPct") && (
                    <div
                      className={
                        styles.amount +
                        " " +
                        `${
                          Number(coin[currentSettings.metricTwoMonitor]) < 0
                            ? styles.red
                            : styles.green
                        }`
                      }
                    >
                      {coin[currentSettings.metricTwoMonitor]}%
                    </div>
                  )}
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
    </div>
  );
};

export default CoinMonitoredList;
