import React, { useState, useContext } from "react";
import CurrencySettingsContext from "../../../context/currencySettings";
import { deleteCoin, updateCoin } from "../../../actions";
import { getSingleCoinData } from "../../../lib/core/singleCoinData";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import UpdateModal from "../../../components/update-modal";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import {
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import _ from "lodash";
import NumberSuffix from "number-suffix";
import { motion } from "framer-motion";

const variants = {
  open: {
    opacity: 1,
    height: "auto",
  },
  closed: { opacity: 0, height: 0, overflow: "hidden" },
};

const Coin = (props) => {
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { coin, roundTo2DP } = props;

  const [isShown, setIsShown] = useState(false);
  const [showMrktAnalysis, setShowMrktAnalysis] = useState(false);
  const [showMrktData, setShowMrktData] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [cancel, setCancel] = useState(false);

  const [anim, setAnim] = useState(0);

  const [currentAmount, setCurrentAmount] = useState(coin[0]["amount"]);

  const showModal = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsShown(false);
  };

  const toggleShowMarketAnalysis = () => {
    setShowMrktAnalysis(!showMrktAnalysis);
  };

  const toggleShowMarketData = () => {
    setShowMrktData(!showMrktData);
  };

  // close modal from window surrounding the modal itself
  const windowOnClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsShown(false);
    }
  };

  const refreshData = () => {
    // Router.replace("/pocket");
    window.location = "/pocket";
  };

  const refreshCoinData = () => {
    setIsShown(false);
    const id = getCoinProp("id");
    Router.replace("/coins/" + id, undefined, { scroll: false });
  };

  const handleCoinUpdate = (newAmount) => {
    const res = updateCoin(getCoinProp("id"), newAmount);
    console.log(res);
  };

  const handleUpdate = (amount) => {
    refreshCoinData();
    const newAmount = [
      {
        amount: amount,
      },
    ];
    setCurrentAmount(amount);
    // closeModal();
    handleCoinUpdate(newAmount);
  };

  const handleDeleteCoin = () => {
    setDeleted(true);
    refreshData();
    const res = deleteCoin(getCoinProp("id"));
    console.log(res);
  };

  const handleCancel = () => {
    setCancel(true);
    Router.replace("/pocket");
  };

  const formatDate = (date) => {
    return _.words(date.substring(2, 10)).reverse().join("-");
  };

  const numAbbreviation = (num) => {
    if (num == "no max") {
      return num;
    }
    return NumberSuffix.format(Number(num), {
      precision: 2,
      style: "abbreviation",
    });
  };

  const circulationPercentage = () => {
    if (getCoinProp("maxSupply") == "no max") {
      return "n/a";
    }

    return (
      roundTo2DP((getCoinProp("supply") / getCoinProp("maxSupply")) * 100) + "%"
    );
  };

  const roundTo3DP = (unrounded) => {
    return (Math.round(unrounded * 1000) / 1000).toFixed(3);
  };

  const roundTo7DP = (unrounded) => {
    return (Math.round(unrounded * 10000000) / 10000000).toFixed(7);
  };

  const getCoinProp = (propName) => {
    return coin[0][propName];
  };

  return (
    <div className={styles.pageLayout}>
      <div
        className={
          styles.logo +
          " " +
          `${getCoinProp("name") === "polkadot" ? styles.withBackground : ""}`
        }
      >
        <Image
          src={getCoinProp("logo_url")}
          alt={getCoinProp("name")}
          layout="fill"
          priority
        />
      </div>
      {isShown ? (
        <UpdateModal
          closeModal={closeModal}
          windowOnClick={windowOnClick}
          handleFormSubmit={handleUpdate}
          name={getCoinProp("name")}
          code={getCoinProp("id")}
          amount={getCoinProp("amount")}
          label="coin"
          isShown={isShown}
        />
      ) : (
        <React.Fragment />
      )}
      <div className={styles.name}>{getCoinProp("name")}</div>
      <div className={styles.code2}>[{getCoinProp("id")}]</div>
      <div className={styles.code2}>{currentAmount} coins</div>
      {currentAmount === getCoinProp("amount") ? (
        <Link
          href={{
            pathname: "/coins/[id]",
            query: { id: coin[0]["id"] },
          }}
          scroll={false}
        >
          <div className={styles.amount} onClick={() => setAnim(1)}>
            {appCurrencySign}
            {roundTo2DP(getCoinProp("total"))}{" "}
            <RefreshCw
              className={styles.refresh}
              onClick={() => setAnim(1)}
              onAnimationEnd={() => setAnim(0)}
              anim={anim}
            />
          </div>
        </Link>
      ) : (
        <div className={styles.amount}>recalculating..</div>
      )}
      <div className={styles.marketHeading} onClick={toggleShowMarketAnalysis}>
        {showMrktAnalysis ? <ChevronUp /> : <ChevronDown />} market analysis
      </div>
      {/* market analysis */}
      <motion.div
        className={styles.collapsibleLayout}
        animate={showMrktAnalysis ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        initial="closed"
      >
        {/* price */}
        <div className={styles.marketSubHeading}>price</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>price</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {Number(getCoinProp("price")) >= 100
              ? roundTo2DP(getCoinProp("price"))
              : Number(getCoinProp("price")) <= 0.0001
              ? roundTo7DP(getCoinProp("price"))
              : roundTo3DP(getCoinProp("price"))}
          </div>
          <div className={styles.tableCellLeft}>price at 1hr</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {Number(getCoinProp("price")) -
              Number(getCoinProp("hPriceChange")) >=
            100
              ? roundTo2DP(
                  Number(getCoinProp("price")) -
                    Number(getCoinProp("hPriceChange"))
                )
              : Number(getCoinProp("price")) -
                  Number(getCoinProp("hPriceChange")) <=
                0.0001
              ? roundTo7DP(
                  Number(getCoinProp("price")) -
                    Number(getCoinProp("hPriceChange"))
                )
              : roundTo3DP(
                  Number(getCoinProp("price")) -
                    Number(getCoinProp("hPriceChange"))
                )}
          </div>
        </div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>price chng</div>
          <div
            className={
              styles.tableCellRight +
              " " +
              `${getCoinProp("hPriceChange") < 0 ? styles.red : styles.green}`
            }
          >
            {appCurrencySign}
            {Number(getCoinProp("hPriceChange")) >= 100 ||
            Number(getCoinProp("hPriceChange")) <= -100
              ? roundTo2DP(getCoinProp("hPriceChange"))
              : Number(getCoinProp("hPriceChange")) <= 0.0001 &&
                Number(getCoinProp("hPriceChange")) >= -0.0001
              ? Number(getCoinProp("hPriceChange")).toExponential(2)
              : roundTo3DP(getCoinProp("hPriceChange"))}
            {getCoinProp("hPriceChange") < 0 ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUp size={16} />
            )}
          </div>
          <div className={styles.tableCellLeft}>price chng %</div>
          <div
            className={
              styles.tableCellRight +
              " " +
              `${
                getCoinProp("hPriceChangePct") < 0 ? styles.red : styles.green
              }`
            }
          >
            {roundTo2DP(getCoinProp("hPriceChangePct"))}%
            {getCoinProp("hPriceChangePct") < 0 ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUp size={16} />
            )}
          </div>
        </div>
        {/* volume */}
        <div className={styles.marketSubHeading}>volume</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>1hr volume</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {numAbbreviation(getCoinProp("hVolume"))}
          </div>
          <div className={styles.tableCellLeft}>prev 1hr vol.</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {numAbbreviation(
              Number(getCoinProp("hVolume")) -
                Number(getCoinProp("hVolumeChange"))
            )}
          </div>
        </div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>vol. chng</div>
          <div
            className={
              styles.tableCellRight +
              " " +
              `${getCoinProp("hVolumeChange") < 0 ? styles.red : styles.green}`
            }
          >
            {appCurrencySign}
            {numAbbreviation(getCoinProp("hVolumeChange"))}
            {getCoinProp("hVolumeChange") < 0 ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUp size={16} />
            )}
          </div>
          <div className={styles.tableCellLeft}>vol. chng %</div>
          <div
            className={
              styles.tableCellRight +
              " " +
              `${
                getCoinProp("hVolumeChangePct") < 0 ? styles.red : styles.green
              }`
            }
          >
            {roundTo2DP(getCoinProp("hVolumeChangePct"))}%
            {getCoinProp("hVolumeChangePct") < 0 ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUp size={16} />
            )}
          </div>
        </div>
      </motion.div>
      {/* market data */}
      <div className={styles.marketHeading} onClick={toggleShowMarketData}>
        {showMrktData ? <ChevronUp /> : <ChevronDown />} market data
      </div>
      <motion.div
        className={styles.collapsibleLayout}
        animate={showMrktData ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        initial="closed"
      >
        {/* all-time high */}
        <div className={styles.marketSubHeading}>all-time high</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>price</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {Number(getCoinProp("price")) >= 100
              ? roundTo2DP(getCoinProp("price"))
              : Number(getCoinProp("price")) <= 0.0001
              ? roundTo7DP(getCoinProp("price"))
              : roundTo3DP(getCoinProp("price"))}
          </div>
          <div className={styles.tableCellLeft}>ath</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {Number(getCoinProp("high")) >= 100
              ? roundTo2DP(getCoinProp("high"))
              : Number(getCoinProp("high")) <= 0.0001
              ? roundTo7DP(getCoinProp("high"))
              : roundTo3DP(getCoinProp("high"))}
            {/* {Number(getCoinProp("high")) >= 100
              ? roundTo2DP(getCoinProp("high"))
              : roundTo3DP(getCoinProp("high"))} */}
          </div>
        </div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>ath date</div>
          <div className={styles.tableCellRight}>
            {formatDate(getCoinProp("highDate"))}
          </div>
          <div className={styles.tableCellLeft}>% ath</div>
          <div className={styles.tableCellRight}>
            {roundTo2DP((getCoinProp("price") / getCoinProp("high")) * 100)}%
          </div>
        </div>
        {/* market capitalisation */}
        <div className={styles.marketSubHeading}>market capitalisation</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>market cap</div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {numAbbreviation(getCoinProp("marketCap"))}
          </div>
          <div className={styles.tableCellLeft}>market cap rank</div>
          <div className={styles.tableCellRight}>{getCoinProp("rank")}</div>
        </div>
        {/* supply */}
        <div className={styles.marketSubHeading}>supply</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>current supply</div>
          <div className={styles.tableCellRight}>
            {numAbbreviation(getCoinProp("supply"))}
          </div>
          <div className={styles.tableCellLeft}>max supply</div>
          <div className={styles.tableCellRight}>
            {numAbbreviation(getCoinProp("maxSupply"))}
          </div>
        </div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>supply %</div>
          <div className={styles.tableCellRight}>{circulationPercentage()}</div>
          <div className={styles.tableCellLeft}>first trade</div>
          <div className={styles.tableCellRight}>
            {formatDate(getCoinProp("firstTrade"))}
          </div>
        </div>
      </motion.div>
      <hr className={styles.solidDivider} />
      <div className={styles.buttons}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={isShown ? { scale: [1, 0.5, 1] } : {}}
          className={styles.updateButton}
          onClick={() => showModal()}
          role="button"
        >
          update
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.25 }}
          animate={deleted ? { scale: [1, 0.5, 1] } : {}}
          className={styles.deleteButton}
          onClick={() => handleDeleteCoin()}
          role="button"
        >
          delete
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          // whileTap={{
          //   transform: "rotateX(180deg)",
          // }}
          transition={{ duration: 0.25 }}
          animate={cancel ? { scale: [1, 0.5, 1] } : {}}
          className={styles.cancelButton}
          onClick={() => handleCancel()}
          role="button"
        >
          cancel
        </motion.button>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const code = query.id;
  const coin = await getSingleCoinData(code);

  // console.log(coin);

  return {
    props: {
      coin,
    },
  };
}

export default Coin;
