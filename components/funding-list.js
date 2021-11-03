import styles from "./listing.module.scss";
import Link from "next/link";
import Image from "next/image";
import eurFlag from "../public/eurFlag.jpg";
import gbpFlag from "../public/gbpFlag.jpg";
import usdFlag from "../public/usdFlag.jpg";
import { Edit2 } from "react-feather";

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
            <div className={styles.listRow}>
              <li className={styles.logoContainer}>
                <div className={styles.flag}>
                  <Image
                    src={getFlag(investment.currencySign)}
                    alt={investment.currencyName}
                    layout="responsive"
                    width={60}
                    height={40}
                  />
                </div>
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
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default FundingList;
