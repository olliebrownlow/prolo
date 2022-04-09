import React, { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import ConfirmDelete from "./confirm-delete";
import styles from "./burgerMenu.module.scss";

const variants = {
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

const BurgerMenuItem = (props) => {
  const { toggle, logout, path, icon, label } = props;
  const router = useRouter();
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [logoutText, setLogoutText] = useState("");
  const [logoutSubText, setLogoutSubText] = useState("");
  const [doDelete, setDoDelete] = useState(false);

  const closeModal = () => {
    setConfirmDeletion(false);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setConfirmDeletion(false);
    }
  };

  const toggleAndProcess = () => {
    if (label === "logout") {
      setConfirmDeletion(true);
      setLogoutText("log out");
      setLogoutSubText(null);
      setDoDelete(false);
    } else if (label === "delete account") {
      setConfirmDeletion(true);
      setLogoutText("delete your account");
      setLogoutSubText(
        " all coin, currency, investment item and note data will be lost as well as your app settings"
      );
      setDoDelete(true);
    } else {
      router.push(path);
      toggle();
    }
  };

  const triggerLogout = () => {
    setConfirmDeletion(false);
    logout(doDelete);
    router.push(path);
    toggle();
  };

  return (
    <>
      <motion.div
        className={styles.li}
        variants={variants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        onClick={toggleAndProcess}
      >
        <div
          className={
            styles.icon +
            " " +
            `${router.pathname === path ? styles.active : ""}`
          }
        >
          {icon}
        </div>
        <div
          className={
            styles.label +
            " " +
            `${router.pathname === path ? styles.active : ""}`
          }
        >
          {label}
        </div>
      </motion.div>
      {confirmDeletion ? (
        <ConfirmDelete
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleDelete={triggerLogout}
          data={""}
          isShown={confirmDeletion}
          titleText={logoutText}
          subText={logoutSubText}
        />
      ) : (
        <React.Fragment />
      )}
    </>
  );
};

export default BurgerMenuItem;
