import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import Link from "next/link";
import styles from "../pageStyles/home.module.scss";

const Home = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <div className={styles.homeLayout}>
            <div>logged in as {user.email}</div>
            <h1>cryptocurrency profit/loss tracker</h1>
            <ol className={styles.items}>
              <li className={styles.item}>monitor your balance and check your profit/loss{" "}
              <Link href="/ledger">
                <a>here</a>
              </Link>
              .</li>
              <li className={styles.item}>add/update your current crypto and fiat holdings{" "}
              <Link href="/pocket">
                <a>here</a>
              </Link>
              .</li>
              <li className={styles.item}>no links to your actual crypto wallet or trade data.</li>
            </ol>
          </div>
        </>
      ) : (
        <div className={styles.homeLayout}>
          <h1>cryptocurrency profit/loss tracker</h1>
          <ol className={styles.items}>
            <li className={styles.item}>monitor your balance and check your profit/loss.</li>
            <li className={styles.item}>log in{" "}
              <Link href="/login">
                <a>here</a>
              </Link> to save your current state.</li>
            <li className={styles.item}>no links to your actual crypto wallet or trade data.</li>
            <li className={styles.item}>
              try without signing up{" "}
              <Link href="/pocket">
                <a>here</a>
              </Link>
              .
            </li>
          </ol>
        </div>
      )}
    </>
  );
};

export default Home;
