import { useContext, useState, useEffect } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import styles from "./settingsLink.module.scss";
import { motion } from "framer-motion";

const SettingsLink = () => {
  const { appCurrencyCode } = useContext(CurrencySettingsContext);
  const [currencyFlag, setCurrencyFlag] = useState(eurFlag);

  useEffect(() => {
    if (appCurrencyCode === "gbp") {
      setCurrencyFlag(gbpFlag);
    } else if (appCurrencyCode != "eur") {
      setCurrencyFlag(usdFlag);
    }
  }, [appCurrencyCode]);

  return (
    <Link href="/settings">
      <motion.div
        className={styles.currencyImg}
        whileTap={{ scale: 0.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <Image
          src={currencyFlag}
          alt={appCurrencyCode}
          layout="intrinsic"
          priority
        />
      </motion.div>
    </Link>
  );
};

export default SettingsLink;
