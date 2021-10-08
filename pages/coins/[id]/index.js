import { deleteCoin } from "../../../actions";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import styles from "../../../pageStyles/dynamicPage.module.scss";

const Coin = (props) => {
  const {
    logo_url,
    total,
    name,
    amount,
    code,
    currencyInUse,
    appCurrencySign,
    roundTo2DP,
  } = props;

  // const defaultData = {
  //   logo_url: logo_url,
  //   total: total,
  //   currencyInUse: currencyInUse,
  //   settingsCurrencySign: settingsCurrencySign,
  //   code: code,
  //   name: name,
  //   amount: amount,
  // };

  // const [data, setData] = useState(defaultData);

  const refreshData = () => {
    window.location = "/pocket";
  };

  const handleDeleteCoin = async () => {
    const res = await deleteCoin(code);
    console.log(res);
    refreshData();
  };

  const handleCancel = () => {
    Router.replace("/pocket");
  };

  return (
    <div className={styles.pageLayout}>
      <Link href="/settings">
        <img
          className={styles.currencyImg}
          src={`../${currencyInUse}Flag.jpg`}
          alt={currencyInUse}
        />
      </Link>
      <img
        className={
          styles.logo +
          " " +
          `${name === "polkadot" ? styles.withBackground : ""}`
        }
        src={logo_url}
        alt={name}
      />

      <div className={styles.name}>{name}</div>
      <div className={styles.code}>[{code}]</div>
      <div className={styles.amount}>{amount} coins</div>
      <p className={styles.total}>
        {appCurrencySign} {roundTo2DP(total)}
      </p>
      <hr className={styles.solidDivider} />
      <div className={styles.buttons}>
        <button className={styles.updateButton} role="button">
          update
        </button>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteCoin()}
          role="button"
        >
          delete
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => handleCancel()}
          role="button"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

Coin.getInitialProps = async ({ query }) => {
  const logo_url = query.logo_url;
  const total = query.total;
  const name = query.name;
  const amount = query.amount;
  const code = query.id;
  const currencyInUse = query.currencyInUse;
  const appCurrencySign = query.appCurrencySign;

  // const coin = await getCoinByCode(query.id);
  return {
    logo_url,
    total,
    name,
    amount,
    code,
    currencyInUse,
    appCurrencySign,
  };
};

export default Coin;
