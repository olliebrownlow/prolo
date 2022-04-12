import styles from "../pageStyles/404.module.scss";

export default function Custom404() {
  return (
    <div className={styles.container}>
      <div className={styles.fourOFour}>
        40.<span className={styles.red}>4-</span>
      </div>
      <div className={styles.subtext}>
        oops..
        <br />
        page not found
      </div>
    </div>
  );
}
