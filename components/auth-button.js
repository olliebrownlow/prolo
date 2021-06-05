import Link from "next/link";
 
import styles from "./authButton.module.scss";
 
const AuthButton = (props) => (
  <Link href={props.path}>
    <div onClick={props.auth} className={styles.AuthButton}>
      <span className={styles.Label}>{props.label}</span>
    </div>
  </Link>
);
 
export default AuthButton;
 