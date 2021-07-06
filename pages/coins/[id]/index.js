import { useRouter } from "next/router";
import { getCoinByCode, deleteCoin } from "../../../actions";
import styles from "../../../pageStyles/coinPage.module.scss";

const Coin = (props) => {
  const { coin } = props;
  const router = useRouter();

  const refreshData = () => {
    window.location = "/pocket";
  };

  const handleDeleteCoin = async () => {
    const res = await deleteCoin(coin.code);
    console.log(res);
    refreshData();
  };

  return (
    <div className={styles.coinPageLayout}>
      <div className={styles.coinName}>{coin.name}</div>
      <div className={styles.coinAmount}>{coin.amount}</div>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() =>
            handleDeleteCoin().then(() => {
              router.push("/pocket");
            })
          }
          role="button"
        >
          delete
        </button>
        <button className={styles.button}>update</button>
      </div>
    </div>
  );
};

Coin.getInitialProps = async ({ query }) => {
  const coin = await getCoinByCode(query.id);
  return { coin };
};

export default Coin;
