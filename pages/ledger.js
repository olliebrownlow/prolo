import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import styles from "../pageStyles/ledger.module.scss";

const Ledger = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.balances}>
            <h1 className={styles.title}>ledger</h1>
            <div className={styles.label}>Email</div>
            <div className={styles.profileInfo}>{user.email}</div>

            <div className={styles.label}>User Id</div>
            <div className={styles.profileInfo}>{user.issuer}</div>
          </div>
        )
      )}
    </>
  );
};

export default Ledger;