import styles from "./listing.module.scss";
import Link from "next/link";
import { Edit2, Edit3 } from "react-feather";

const FundingList = (props) => {
  const { roundTo2DP, fundingHistoryData, appCurrencySign } = props;

  // when user has no investments inputted, an
  // empty array must be returned for
  // reliable mapping.
  // const emptyOrOrderedArray = () => {
  //   if (coinData[0].total) {
  //     return coinData.sort((a, b) => b.total - a.total);
  //   } else {
  //     return [];
  //   }
  // };

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
    <>
      {fundingHistoryData.map((investment) => (
        <div key={investment.id}>
          <Link
            href={{
              pathname: "/investments/[id]",
              query: {
                id: investment.id,
                currencyName: investment.currencyName,
                currencyCode: investment.currencyCode,
                currencySign: investment.currencySign,
                type: investment.type,
                amount: investment.amount,
                date: investment.date,
                euros: investment.euros,
                britishSterling: investment.britishSterling,
                americanDollars: investment.americanDollars,
                appCurrencySign: appCurrencySign,
              },
            }}
          >
          <ul className={styles.listRow}>
            <li className={styles.logoContainer}>
              <img
                className={styles.logo}
                src={`./${investment.currencyCode}Flag.jpg`}
                alt={investment.currencyName}
              />
            </li>
            <li className={styles.fundingValue}>
              {investment.currencySign}
              {roundTo2DP(investment.amount)}
              <div className={styles.type}>{investment.type}</div>
            </li>
            <li className={styles.date}>
              {investment.date}
              <div className={styles.hidden}>placeholder</div>
            </li>
            <li className={styles.fundingValue}>
              {appCurrencySign}
              {roundTo2DP(getFiatValueBasedOnSetAppCurrency(investment))}
              <div className={styles.hidden}>placeholder</div>
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

export default FundingList;
