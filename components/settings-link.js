import { useContext, useState, useEffect } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import styles from "./settingsLink.module.scss";

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
      <div className={styles.currencyImg}>
        <Image
          src={currencyFlag}
          alt={appCurrencyCode}
          layout="intrinsic"
          priority
        />
      </div>
    </Link>
  );
};

export default SettingsLink;
