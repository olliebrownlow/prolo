import { useContext } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import AddButton from "../components/add-button";
import FundingList from "../components/funding-list";
import styles from "../pageStyles/ledger.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";
import { getFundingData } from "../actions";
import { RefreshCw } from "react-feather";
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
            <Link href="/ledger">
              <div className={styles.prolo}>
                {appCurrencySign}
                {roundTo2DP(prolo())} <RefreshCw />
              </div>
            </Link>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>balance</div>
            <div className={styles.balance}>
              {appCurrencySign}
              {roundTo2DP(balance)}
            </div>
            <hr className={styles.solidDivider} />
            <div className={styles.heading}>funding history</div>
            <AddButton
              buttonText={"add item"}
              // showModal={showModal}
              showLogo={true}
            />
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
