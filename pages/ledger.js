import { useContext } from "react";
import CurrencySettingsContext from "../context/currencySettings";
import Link from "next/link";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import styles from "../pageStyles/ledger.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";

const Ledger = (props) => {
  const { roundTo2DP, balance } = props;

  const [user] = useContext(UserContext);
  const { appCurrencySign, appCurrencyCode } = useContext(
    CurrencySettingsContext
  );

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
            <div className={styles.balances}>
              <h1 className={styles.title}>ledger</h1>
              <h1 className={styles.title}>
                {appCurrencySign} {roundTo2DP(balance)}
              </h1>
            </div>
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
  // console.log(fiatData);
  // console.log(coinData);
  // console.log(balance)

  return {
    props: {
      balance,
    },
  };
}

export default Ledger;
