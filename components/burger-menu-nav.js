import React, { useEffect, useState } from "react";
import { getCookie, checkCookies } from "cookies-next";
import { motion } from "framer-motion";
import BurgerMenuItem from "./burger-menu-item";
import {
  burgerMenuNavButtons,
  burgerMenuDangerButtons,
} from "../config/burgerMenuButtons";
import { getUserEmail } from "../actions";
import styles from "./burgerMenu.module.scss";
import { User } from "react-feather";

const variants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
    height: "auto",
    width: "284px",
  },
  closed: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
    height: 0,
    width: 0,
    overflow: "hidden",
  },
};

const variants2 = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
    height: "auto",
    width: "auto",
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
    height: 0,
    width: 0,
    overflow: "hidden",
  },
};

const BurgerMenuNav = (props) => {
  const { toggle, logout } = props;
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getAndSetUserEmail = async () => {
      const res = await getUserEmail(getCookie("un"));
      setUserEmail(res);
    };
    if (checkCookies("un")) {
      getAndSetUserEmail();
    }
  }, [getCookie("un")]);

  const extractUserName = (userEmail) => {
    const name = userEmail.split("@");
    return name[0];
  };

  return (
    <motion.ul className={styles.ul} variants={variants}>
      <motion.div className={styles.user} variants={variants2}>
        <User size={20} /> {extractUserName(userEmail)}
      </motion.div>
      <motion.hr className={styles.solidDivider} variants={variants2} />
      {burgerMenuNavButtons.map((button) => (
        <BurgerMenuItem
          toggle={toggle}
          key={button.path}
          path={button.path}
          label={button.label}
          icon={button.icon}
        />
      ))}
      <motion.hr className={styles.solidDivider} variants={variants2} />
      {burgerMenuDangerButtons.map((button) => (
        <BurgerMenuItem
          toggle={toggle}
          logout={logout}
          key={button.label}
          path={button.path}
          label={button.label}
          icon={button.icon}
        />
      ))}
      <motion.hr className={styles.solidDivider} variants={variants2} />
    </motion.ul>
  );
};

export default BurgerMenuNav;
