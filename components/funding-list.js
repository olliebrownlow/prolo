import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlagSmall.jpg";
import gbpFlag from "../public/gbpFlagSmall.png";
import usdFlag from "../public/usdFlagSmall.jpg";
import { ArrowUpRight } from "react-feather";

const FundingList = (props) => {
  const { roundTo2DP, fundingHistoryData, appCurrencySign } = props;

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
    <div  className={styles.listContainer}>
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
            <div className={styles.listRow}>
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
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default FundingList;
