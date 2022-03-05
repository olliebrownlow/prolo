import { getCookie } from "cookies-next";
import { getCurrencyAndTheme } from "../actions/index";
import Image from "next/image";
import tumbleVideo from "../public/prolo_tumble_video_2.5.gif";
import blackImage from "../public//prolo_none_completeBlack_filled.png";
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
          <Image src={blackImage} alt={"prolo"} layout="intrinsic" priority />
        </div>
      ) : (
        <div className={styles.prolo}>
          <Image src={tumbleVideo} alt={"prolo"} layout="intrinsic" priority />
        </div>
      )}
      <Link href="/ledger">
        <motion.div
          className={styles.darkItem}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <BookOpen size={44} />
          add investment history and check balance and overall profit/loss
        </motion.div>
      </Link>
      <Link href="/pocket">
        <motion.div
          className={styles.lightItem}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <Pocket size={44} />
          add, update and delete crypto and fiat portfolios
        </motion.div>
      </Link>
      <Link href="/monitor">
        <motion.div
          className={styles.darkItem}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <TrendingUp size={44} />
          monitor coins and see market data
        </motion.div>
      </Link>
      <Link href="/settings">
        <motion.div
          className={styles.lightItem}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <Settings size={44} />
          switch currency and theme settings <br /> £, $ and € supprted
          <br /> dark/light themes
        </motion.div>
      </Link>
      <div className={styles.darkItem}>
        <Clipboard size={44} />
        use notepad functionality to remember important trading info
      </div>
      <div className={styles.lightItem}>
        <CloudOff size={44} />
        no links to crypto wallets or personal trade data
      </div>
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
  const user = getCookie("ue", { req, res });
  const currencyAndTheme = await getCurrencyAndTheme(user);
  // console.log(user);
  // console.log(currencyAndTheme);
  return {
    props: {
      currencyAndTheme,
    },
  };
}

export default Home;
