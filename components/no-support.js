import styles from "./noSupport.module.scss";

const NoSupport = (props) => {
  const { labelName, title } = props;

  return (
    <>
      <h1 className={styles.heading}>{title}</h1>
      <hr className={styles.solidDivider} />
      <div className={styles.content}>
        all currently supported {labelName} options in use
      </div>
    </>
  );
};

export default NoSupport;
