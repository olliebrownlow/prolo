import { useContext, useState, useEffect } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import { getCookie } from "cookies-next";
import { getCurrencyAndTheme } from "../actions";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import styles from "./settingsLink.module.scss";
import { Moon, Sun } from "react-feather";
import { motion } from "framer-motion";

const SettingsLink = () => {
  const { appCurrencyCode } = useContext(CurrencySettingsContext);
  const [currencyFlag, setCurrencyFlag] = useState(eurFlag);
  const [currentTheme, setCurrentTheme] = useState("");

  useEffect(() => {
    if (appCurrencyCode === "gbp") {
      setCurrencyFlag(gbpFlag);
    } else if (appCurrencyCode != "eur") {
      setCurrencyFlag(usdFlag);
    }
  }, [appCurrencyCode]);

  useEffect(async () => {
    const user = getCookie("ue");
    const currencyAndTheme = await getCurrencyAndTheme(user);
    setCurrentTheme(currencyAndTheme.theme);
  }, []);

  return (
    <Link href="/settings">
      <motion.div
        className={styles.split}
        whileTap={{ scale: 0.5 }}
        whileHover={{ scale: 1.1 }}
      >
        {currentTheme === "dark" ? (
          <>
            <div
              className={styles.left}
              style={{
                backgroundImage:
                  "url(" + `/${appCurrencyCode}FlagSmall.jpg` + ")",
                borderColor: "white",
              }}
            ></div>
            <div className={styles.right}>
              <Moon size={16} />
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.left}
              style={{
                backgroundImage:
                  "url(" + `/${appCurrencyCode}FlagSmall.jpg` + ")",
                borderColor: "dimgrey",
              }}
            ></div>
            <div className={styles.right}>
              <Sun size={16} />
            </div>
          </>
        )}
      </motion.div>
    </Link>
  );
};

export default SettingsLink;
