import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import { motion } from "framer-motion";
import { ArrowUpRight } from "react-feather";

const FiatList = (props) => {
  const { roundTo2DP, fiatData, appCurrencySign } = props;

  const orderedArray = () => {
    return fiatData.sort((a, b) => b.value - a.value);
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

  return (
    <div className={styles.listContainer}>
      {orderedArray().map((fiatData) => (
        <div key={fiatData.id}>
          <Link
            href={{
              pathname: "/fiat/[id]",
              query: {
                id: fiatData.id,
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
                <div className={styles.flag}>
                  <Image
                    src={getFlag(fiatData.fiatSign)}
                    alt={fiatData.from}
                    layout="fill"
                    priority
                  />
                </div>
              </div>
              <div className={styles.name}>
                {fiatData.fullFiatName}
                <div className={styles.hidden}>placeholder</div>
              </div>
              <div className={styles.totalValue}>
                {fiatData.fiatSign}
                {roundTo2DP(fiatData.amount)}
                <div className={styles.amount}>
                  {appCurrencySign}
                  {roundTo2DP(fiatData.value)}
                </div>
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

export default FiatList;
