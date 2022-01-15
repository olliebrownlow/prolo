import puff from "../public/puff.svg";
import styles from "./loading.module.scss";
import Image from "next/image";

const Loading = () => (
  <div className={styles.loading}>
    <Image layout="intrinsic" priority src={puff} height={80} width={80} alt="Loading" />
  </div>
);

export default Loading;
