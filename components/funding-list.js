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
          {/* <Link
            href={{
              pathname: "/coins/[id]",
              query: {
                id: coin.id,
                name: coin.name,
                logo_url: coin.logo_url,
                amount: coin.amount,
                total: coin.total,
                price: coin.price,
                appCurrencySign: appCurrencySign,
              },
            }}
          > */}
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
              {investment.amount}
              <div className={styles.direction}>{investment.direction}</div>
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
          {/* </Link> */}
        </div>
      ))}
    </>
  );
};

export default FundingList;
