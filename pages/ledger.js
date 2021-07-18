import { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import { getBalance } from "../actions";
import styles from "../pageStyles/ledger.module.scss";

const Ledger = (props) => {
  const { balance, roundTo2DP } = props;
  const [user] = useContext(UserContext);

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
                src={`./${balance[0].code}Flag.jpg`}
                alt={balance[0].code}
              />
            </Link>
            <div className={styles.balances}>
              <h1 className={styles.title}>ledger</h1>
              <h1 className={styles.title}>
                {balance[0].sign} {roundTo2DP(balance[0].amount)}
              </h1>
            </div>
          </div>
        )
      )}
    </>
  );
};

export async function getServerSideProps() {
  const balance = await getBalance();

  // console.log(balance);
  return {
    props: {
      balance,
    },
  };
}

export default Ledger;
