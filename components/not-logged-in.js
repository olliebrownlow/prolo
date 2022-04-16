import React from "react";
import { useRouter } from "next/router";
import styles from "./notLoggedIn.module.scss";
import { UserX } from "react-feather";
import { motion } from "framer-motion";

const NotLoggedIn = () => {
  const router = useRouter();

  const login = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <UserX size={88} strokeWidth={1} borderStyle="solid" />
      <div className={styles.heading}>
        oops!
        <br />
        please login or signup to see this page
      </div>
      <motion.button
        className={styles.button}
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.75 }}
        onClick={login}
      >
        login/signup
      </motion.button>
    </div>
  );
};

export default NotLoggedIn;
