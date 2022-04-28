import * as React from "react";
import { motion, useCycle } from "framer-motion";
import BurgerMenuToggle from "./burger-menu-toggle";
import BurgerMenuNav from "./burger-menu-nav";
import styles from "./burgerMenu.module.scss";

const sidebar = {
  open: (height = window.innerHeight + 50) => ({
    clipPath: `circle(${height}px at 36px 25px)`,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
    height: "auto",
    width: `300px`,
    overflow: "scroll",
    marginLeft: "4px",
    marginTop: "4px",
  }),
  closed: {
    clipPath: "circle(20px at 36px 25px)",
    transition: {
      delay: 0.25,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
    height: "50px",
    width: "60px",
    overflow: "hidden",
  },
};

const BurgerMenu = ({ logout }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <motion.nav
      className={styles.navigation}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div className={styles.background} variants={sidebar}>
        <BurgerMenuNav toggle={() => toggleOpen()} logout={logout} />
        <BurgerMenuToggle toggle={() => toggleOpen()} />
      </motion.div>
    </motion.nav>
  );
};

export default BurgerMenu;
