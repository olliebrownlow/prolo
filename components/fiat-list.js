import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlag.jpg";
import gbpFlag from "../public/gbpFlag.jpg";
import usdFlag from "../public/usdFlag.jpg";
import { Edit2 } from "react-feather";

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
    <>
      {orderedArray().map((fiatData) => (
        <div key={fiatData.id}>
          <Link
            href={{
              pathname: "/fiat/[id]",
              query: {
                id: fiatData.id,
                name: fiatData.fullFiatName,
                amount: fiatData.amount,
                total: fiatData.value,
                fiatSign: fiatData.fiatSign,
                appCurrencySign: appCurrencySign,
              },
            }}
          >
            <div className={styles.listRow}>
              <li className={styles.logoContainer}>
                <div className={styles.flag}>
                  <Image
                    src={getFlag(fiatData.fiatSign)}
                    alt={fiatData.from}
                    layout="responsive"
                    width={60}
                    height={40}
                  />
                </div>
              </li>
              <li className={styles.name}>
                {fiatData.fullFiatName}
                <div className={styles.hidden}>placeholder</div>
              </li>
              <li className={styles.totalValue}>
                {fiatData.fiatSign}
                {roundTo2DP(fiatData.amount)}
                <div className={styles.amount}>
                  {appCurrencySign}
                  {roundTo2DP(fiatData.value)}
                </div>
              </li>
              <li className={styles.editIcon}>
                <Edit2 />
              </li>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default FiatList;
