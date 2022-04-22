import { getCookie } from "cookies-next";
import { getCurrencyAndTheme } from "../actions/index";
import Image from "next/image";
import tumbleVideo from "../public/prolo_tumble_video_2.5.gif";
import tumbleWhite from "../public/tumbleWhite.gif";
import Link from "next/link";
import styles from "../pageStyles/home.module.scss";
import { motion } from "framer-motion";
import {
  BookOpen,
  Pocket,
  TrendingUp,
  Settings,
  Clipboard,
  CloudOff,
} from "react-feather";

const Home = (props) => {
  const { currencyAndTheme } = props;

  return (
    <div className={styles.homeLayout}>
      {currencyAndTheme.theme === "light" ? (
        <div className={styles.prolo}>
          <Image src={tumbleWhite} alt={"prolo"} layout="intrinsic" priority />
        </div>
      ) : (
        <div className={styles.prolo}>
          <Image src={tumbleVideo} alt={"prolo"} layout="intrinsic" priority />
        </div>
      )}
      <Link href="/ledger">
        <motion.div
          className={
            currencyAndTheme.theme === "dark"
              ? styles.darkThemeDarkItem
              : styles.lightThemeDarkItem
          }
          transition={{ duration: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0.1 }}
          whileTap={{ scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <BookOpen size={44} />
          add investment history - check balance & overall profit/loss
        </motion.div>
      </Link>
      <Link href="/pocket">
        <motion.div
          className={
            currencyAndTheme.theme === "dark"
              ? styles.darkThemeLightItem
              : styles.lightThemeLightItem
          }
          transition={{ duration: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0.1 }}
          whileTap={{ scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <Pocket size={44} />
          add, update & delete crypto and fiat portfolios
        </motion.div>
      </Link>
      <Link href="/monitor">
        <motion.div
          className={
            currencyAndTheme.theme === "dark"
              ? styles.darkThemeDarkItem
              : styles.lightThemeDarkItem
          }
          transition={{ duration: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0.1 }}
          whileTap={{ scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <TrendingUp size={44} />
          monitor coins & see market data
        </motion.div>
      </Link>
      <Link href="/settings">
        <motion.div
          className={
            currencyAndTheme.theme === "dark"
              ? styles.darkThemeLightItem
              : styles.lightThemeLightItem
          }
          transition={{ duration: 0.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0.1 }}
          whileTap={{ scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <Settings size={44} />
          switch currency & theme settings <br /> £, $ and € supported
          <br /> dark/light themes
        </motion.div>
      </Link>
      <motion.div
        className={
          currencyAndTheme.theme === "dark"
            ? styles.darkThemeDarkItem
            : styles.lightThemeDarkItem
        }
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.1 }}
      >
        <Clipboard size={44} />
        use notepad functionality to remember important trading info
      </motion.div>
      <motion.div
        className={
          currencyAndTheme.theme === "dark"
            ? styles.darkThemeLightItem
            : styles.lightThemeLightItem
        }
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.1 }}
      >
        <CloudOff size={44} />
        no links to crypto wallets or personal trade data
      </motion.div>
      <Link href="https://nomics.com">
        <motion.div
          className={styles.nomicsCredit}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          Crypto Market Cap & Pricing Data Provided By Nomics
        </motion.div>
      </Link>
      <Link href="https://currencyscoop.com">
        <motion.div
          className={styles.scoopCredit}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          Exchange Rate Data Provided By CurrencyScoop
        </motion.div>
      </Link>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  const userNumber = getCookie("un", { req, res });
  const currencyAndTheme = await getCurrencyAndTheme(userNumber);
  // console.log(userNumber);
  // console.log(currencyAndTheme);
  return {
    props: {
      currencyAndTheme,
    },
  };
}

export default Home;
