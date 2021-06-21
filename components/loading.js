import styles from "./loading.module.scss";

const Loading = () => (
  <img
    className={styles.loading}
    src="./puff.svg"
    height="80px"
    alt="Loading"
  />
);

export default Loading;
