import { useContext } from "react";
import { UserContext } from "../lib/UserContext";
import Loading from "../components/loading";
import styles from "../components/settings.module.scss"

const Settings = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <div className={styles.settings}>
            <h1 className={styles.title}>app settings</h1>
            <div className={styles.buttons}>
              <button
                className={styles.button}
                // onClick={handleSubmit}
              >
                eur
              </button>
              <button
                className={styles.button}
                // onClick={handleSubmit}
              >
                gbp
              </button>
              <button
                className={styles.button}
                // onClick={handleSubmit}
              >
                usd
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Settings;
