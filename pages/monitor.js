import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import Link from "next/link";
import styles from "../pageStyles/home.module.scss";

const Monitor = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <>
          <div className={styles.homeLayout}>
            <div>logged in as {user.email}</div>
          </div>
        </>
      ) : (
        <div className={styles.homeLayout}>
          <h1>cryptocurrency profit/loss tracker</h1>
        </div>
      )}
    </>
  );
};

export default Monitor;
