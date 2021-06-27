import styles from "./listing.module.scss";
import { Edit3 } from "react-feather";

const FiatList = (props) => {
  const { roundTo2DP, convertedBalanceData, settingsCurrencySign } = props;

  return (
    <>
      {convertedBalanceData.map((fiatData) => (
        <div key={fiatData.id}>
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
              {fiatData.amount}
              <div className={styles.amount}>
                {settingsCurrencySign}
                {roundTo2DP(fiatData.value)}
              </div>
            </li>
            <li className={styles.editIcon}>
              <Edit3 />
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

export default FiatList;
