import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import { motion } from "framer-motion";
import { ArrowUpRight } from "react-feather";

const FundingList = (props) => {
  const { roundTo2DP, fundingHistoryData, appCurrencySign } = props;

  // when user has not entered funding items, an
  // empty array must be returned for
  // reliable mapping.
  const emptyOrOrderedArray = () => {
    if (fundingHistoryData.length) {
      return fundingHistoryData.sort(
        (a, b) => b.sortingNumber - a.sortingNumber
      );
    } else {
      return [];
    }
  };

  const getFlag = (sign) => {
    if (sign === "£") {
      return gbpFlag;
    } else if (sign === "$") {
      return usdFlag;
    } else {
      return eurFlag;
    }
  };

  const getFiatValueBasedOnSetAppCurrency = (investment) => {
    let value;
    switch (appCurrencySign) {
      case "€":
        value = investment.euros;
        break;
      case "£":
        value = investment.britishSterling;
        break;
      case "$":
        value = investment.americanDollars;
        break;
      default:
        value = "error";
    }
    return value;
  };

  return (
    <div className={styles.listContainer}>
      {emptyOrOrderedArray().map((investment) => (
        <div key={investment.id}>
          <Link
            href={{
              pathname: "/investments/[id]",
              query: {
                id: investment.id,
              },
            }}
          >
            <motion.div
              className={styles.listRow}
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <div className={styles.logoContainer}>
                <div className={styles.flag}>
                  <Image
                    src={getFlag(investment.currencySign)}
                    alt={investment.currencyName}
                    layout="fill"
                    priority
                  />
                </div>
              </div>
              <div className={styles.fundingValue1}>
                {investment.currencySign}
                {roundTo2DP(investment.amount)}
                <div className={styles.type}>{investment.type}</div>
              </div>
              <div className={styles.date}>
                {investment.date}
                <div className={styles.hidden}>placeholder</div>
              </div>
              <div className={styles.fundingValue2}>
                {appCurrencySign}
                {roundTo2DP(getFiatValueBasedOnSetAppCurrency(investment))}
                <div className={styles.hidden}>placeholder</div>
              </div>
              <div className={styles.editIcon}>
                <ArrowUpRight size={32} />
              </div>
            </motion.div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default FundingList;
