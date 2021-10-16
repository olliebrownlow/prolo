import { useContext } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import FundingList from "../components/funding-list";
import styles from "../pageStyles/ledger.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";
import { getFundingData } from "../actions";
const camelCase = require("camelcase");

const Ledger = (props) => {
  const { roundTo2DP, balance, fundingHistoryData } = props;

  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyCode, appCurrencyName } = useContext(
    CurrencySettingsContext
  );

  const prolo = () => {
    const propertyName = camelCase(appCurrencyName);
    const valuesArray = [];
    fundingHistoryData.map((investment) => {
      valuesArray.push(parseFloat(investment[propertyName]));
    });
    const unroundedInvestmentValue = valuesArray.reduce(
      (accumulator, current) => accumulator + current
    );
    return balance - unroundedInvestmentValue;
  };

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.ledgerLayout}>
            <Link href="/settings">
              <img
                className={styles.currencyImg}
                src={`./${appCurrencyCode}Flag.jpg`}
                alt={appCurrencyCode}
              />
            </Link>
            <div className={styles.heading}>profit/loss</div>
            <div className={styles.prolo}>
              {appCurrencySign}
              {roundTo2DP(prolo())}
            </div>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>balance</div>
            <div className={styles.balance}>
              {appCurrencySign}
              {roundTo2DP(balance)}
            </div>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>funding history</div>
            <FundingList
              roundTo2DP={roundTo2DP}
              fundingHistoryData={fundingHistoryData}
              appCurrencySign={appCurrencySign}
            />
          </div>
        )
      )}
    </>
  );
};

export async function getServerSideProps() {
  const coinData = await getCoinData();
  const fiatData = await getFiatData();
  const balance = await calculateBalance(coinData, fiatData);
  const fundingHistoryData = await getFundingData();
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(balance)

  return {
    props: {
      balance,
      fundingHistoryData,
    },
  };
}

export default Ledger;
