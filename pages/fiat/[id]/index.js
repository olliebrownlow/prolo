import { deleteFiat } from "../../../actions";
import Link from "next/link";
import Router from 'next/router';
import { useState } from "react";
import styles from "../../../pageStyles/dynamicPage.module.scss";

const Fiat = (props) => {
  const {
    total,
    name,
    amount,
    code,
    fiatSign,
    currencyInUse,
    appCurrencySign,
  } = props;

  // const defaultData = {
  //   total: total,
  //   name: name,
  //   amount: amount,
  //   code: code,
  //   fiatSign: fiatSign,
  //   currencyInUse: currencyInUse,
  //   appCurrencySign: appCurrencySign,
  // };

  // const [data, setData] = useState(defaultData);

  const refreshData = () => {
    window.location = "/pocket";
  };

  const handleDeleteFiat = async () => {
    const res = await deleteFiat(code);
    console.log(res);
    refreshData();
  };

  const handleCancel = () => {
    Router.replace("/pocket")
  };

  const roundTo2DP = (unrounded) => {
    return (Math.round(unrounded * 100) / 100).toFixed(2);
  };

  return (
    <div className={styles.pageLayout}>
      <Link href="/settings" replace>
        <img
          className={styles.currencyImg}
          src={`../${currencyInUse.toLowerCase()}Flag.jpg`}
          alt={currencyInUse}
        />
      </Link>
      <img
        className={styles.logo}
        src={`../${code.toLowerCase()}Flag.jpg`}
        alt={name}
      />

      <div className={styles.name}>{name}</div>
      <div className={styles.code}>[{code}]</div>
      <div className={styles.amount}>
        {fiatSign} {roundTo2DP(amount)}
      </div>
      <p className={styles.total}>
        {appCurrencySign} {roundTo2DP(total)}
      </p>
      <hr className={styles.solidDivider} />
      <div className={styles.buttons}>
        <button className={styles.updateButton}>update</button>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteFiat()}
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

Fiat.getInitialProps = async ({ query }) => {
  const total = query.total;
  const name = query.name;
  const amount = query.amount;
  const code = query.id;
  const fiatSign = query.fiatSign;
  const currencyInUse = query.currencyInUse;
  const appCurrencySign = query.appCurrencySign;

  // const fiat = await getFiatByCode(query.id);
  return {
    total,
    name,
    amount,
    code,
    fiatSign,
    currencyInUse,
    appCurrencySign,
  };
};

export default Fiat;
