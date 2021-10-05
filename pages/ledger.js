import { useState, useEffect } from "react";
import { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import useSWR, { mutate } from "swr";
import axios from "axios";
import styles from "../pageStyles/ledger.module.scss";
import { getCoinData } from "../lib/core/coinData";
import { getFiatData } from "../lib/core/fiatData";
import { calculateBalance } from "../lib/core/calculateBalance";

const fetcher = (url) => axios.get(url);

const Ledger = (props) => {
  const { roundTo2DP, balance } = props;
  const [user] = useContext(UserContext);
  const [balanceData, setBalanceData] = useState([]);

  const BASE_URL = "http://localhost:3000";

  const { data, error } = useSWR(`${BASE_URL}/api/v1/balance`, fetcher);

  useEffect(async () => {
    // mutate("http://localhost:3000/api/v1/balance");
    setBalanceData(data.data[0]);
  }, [data, balanceData]);

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
                src={`./${balanceData.code}Flag.jpg`}
                alt={balanceData.code}
              />
            </Link>
            <div className={styles.balances}>
              <h1 className={styles.title}>ledger</h1>
              <h1 className={styles.title}>
                {balanceData.sign} {roundTo2DP(balance)}
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
