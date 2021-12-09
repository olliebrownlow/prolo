import Link from "next/link";
import { withRouter } from "next/router";
import { motion } from "framer-motion";
import styles from "./navButton.module.scss";

const NavButton = (props) => (
  <Link href={props.path}>
    <motion.div
      className={
        styles.NavButton +
        " " +
        `${props.router.pathname === props.path ? styles.active : ""}`
      }
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
    >
      <div className={styles.Icon}>{props.icon}</div>
      <span className={styles.Label}>{props.label}</span>
    </motion.div>
  </Link>
);

export default withRouter(NavButton);
