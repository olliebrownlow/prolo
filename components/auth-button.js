import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./authButton.module.scss";

const AuthButton = (props) => (
  <Link href={props.path}>
    <motion.div
      onClick={props.auth}
      className={styles.AuthButton}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.5 }}
    >
      <span className={styles.Label}>{props.label}</span>
    </motion.div>
  </Link>
);

export default AuthButton;
