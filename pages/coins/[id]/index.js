import { getCoinByCode, deleteCoin } from "../../../actions";
import styles from "../../../pageStyles/coinPage.module.scss";

const Coin = (props) => {
  const { coin, logo_url } = props;

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
      <img src={logo_url} alt={coin.name} />
      <div className={styles.coinName}>{coin.name}</div>
      <div className={styles.coinAmount}>{coin.amount}</div>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => handleDeleteCoin()}
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
  const logo_url = query.logo_url;
  const coin = await getCoinByCode(query.id);
  return { coin, logo_url };
};

export default Coin;
