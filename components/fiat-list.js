import styles from "./listing.module.scss";
import Link from "next/link";
import { Edit2, Edit3 } from "react-feather";

const FiatList = (props) => {
  const { roundTo2DP, convertedBalanceData, settingsCurrencySign } = props;

  const orderedArray = () => {
    return convertedBalanceData.sort((a, b) => b.value - a.value);
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
                currencyInUse: fiatData.to,
                settingsCurrencySign: settingsCurrencySign,
              },
            }}
          >
            <ul className={styles.listRow}>
              <li className={styles.logoContainer}>
                <img
                  className={styles.logo}
                  src={`./${fiatData.from.toLowerCase()}Flag.jpg`}
                  alt={fiatData.from}
                />
              </li>
              <li className={styles.name}>
                {fiatData.fullFiatName}
                <div className={styles.hidden}>placeholder</div>
              </li>
              <li className={styles.totalValue}>
                {fiatData.fiatSign}
                {roundTo2DP(fiatData.amount)}
                <div className={styles.amount}>
                  {settingsCurrencySign}
                  {roundTo2DP(fiatData.value)}
                </div>
              </li>
              <li className={styles.editIcon}>
                <Edit2 />
              </li>
            </ul>
          </Link>
        </div>
      ))}
    </>
  );
};

export default FiatList;
