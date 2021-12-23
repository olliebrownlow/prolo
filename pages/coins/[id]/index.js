import React, { useState, useContext } from "react";
import CurrencySettingsContext from "../../../context/currencySettings";
import {
  deleteCoin,
  updateCoin,
  getMrktInfoSettings,
  updateMrktInfoSettings,
} from "../../../actions";
import { getSingleCoinData } from "../../../lib/core/singleCoinData";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import UpdateModal from "../../../components/update-modal";
import Interval from "../../../components/interval";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import { ArrowUp, ArrowDown, RefreshCw, ChevronDown } from "react-feather";
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
  const { coin, mrktInfoSettings, roundTo2DP } = props;

  const [isShown, setIsShown] = useState(false);
  const [showMrktAnalysis, setShowMrktAnalysis] = useState(
    mrktInfoSettings[0].showMrktAnalysis
  );
  const [showMrktData, setShowMrktData] = useState(
    mrktInfoSettings[0].showMrktData
  );
  const [deleted, setDeleted] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [anim, setAnim] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(coin[0]["amount"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interval, setInterval] = useState("h");
  const [intervalLabel, setIntervalLabel] = useState("1hr");

  const handleIndexChange = (index) => {
    setCurrentIndex(index);
    switch (index) {
      case 0:
        setInterval("h");
        setIntervalLabel("1hr");
        break;
      case 1:
        setInterval("d");
        setIntervalLabel("1d");
        break;
      case 2:
        setInterval("w");
        setIntervalLabel("1w");
        break;
      case 3:
        setInterval("m");
        setIntervalLabel("1m");
        break;
      case 4:
        setInterval("y");
        setIntervalLabel("1yr");
        break;
      case 5:
        setInterval("ytd");
        setIntervalLabel("ytd");
        break;
      default:
        setInterval("h");
        setIntervalLabel("1hr");
    }
  };

  const showModal = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsShown(false);
  };

  const handleMrktInfoUpdate = (newSetting) => {
    const res = updateMrktInfoSettings(newSetting);
    console.log(res);
  };

  const toggleShowMarketAnalysis = () => {
    const newSetting = [
      {
        showMrktAnalysis: !showMrktAnalysis,
      },
    ];
    setShowMrktAnalysis(!showMrktAnalysis);
    handleMrktInfoUpdate(newSetting);
  };

  const toggleShowMarketData = () => {
    const newSetting = [
      {
        showMrktData: !showMrktData,
      },
    ];
    setShowMrktData(!showMrktData);
    handleMrktInfoUpdate(newSetting);
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
    const id = getCoinProp("id");
    Router.replace("/coins/" + id, undefined, { scroll: false });
  };

  const handleCoinUpdate = (newAmount) => {
    const res = updateCoin(getCoinProp("id"), newAmount);
    console.log(res);
    setTimeout(closeModal, 500);
  };

  const handleUpdate = (amount) => {
    const newAmount = [
      {
        amount: amount,
      },
    ];
    setCurrentAmount(amount);
    handleCoinUpdate(newAmount);
    refreshCoinData();
  };

  const handleDeleteCoin = () => {
    setDeleted(true);
    refreshData();
    const res = deleteCoin(getCoinProp("id"));
    console.log(res);
  };

  const handleCancel = () => {
    setCancel(true);
    Router.back();
  };

  const formatDate = (date) => {
    return _.words(date.substring(2, 10)).reverse().join("-");
  };

  const numAbbreviation = (num, precision) => {
    if (num == "no max") {
      return num;
    }
    return NumberSuffix.format(Number(num), {
      precision: precision,
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
      <motion.div
        className={styles.marketHeading}
        onClick={toggleShowMarketAnalysis}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.span
          animate={
            showMrktAnalysis
              ? { transform: "rotateX(180deg)" }
              : { transform: "rotateX(0deg)" }
          }
          transition={{ duration: 0.5 }}
          initial={false}
        >
          <ChevronDown />
        </motion.span>
        market analysis
      </motion.div>
      {/* market analysis */}
      <motion.div
        className={styles.collapsibleLayout}
        animate={showMrktAnalysis ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        initial={false}
      >
        <div className={styles.intervalSelectionHeading}>
          interval selection
        </div>
        <Interval currentIndex={currentIndex} onChange={handleIndexChange} />
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
          <div className={styles.tableCellLeft}>
            price at {`${intervalLabel}`}
          </div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {Number(getCoinProp("price")) -
              Number(getCoinProp(`${interval}PriceChange`)) >=
            100
              ? roundTo2DP(
                  Number(getCoinProp("price")) -
                    Number(getCoinProp(`${interval}PriceChange`))
                )
              : Number(getCoinProp("price")) -
                  Number(getCoinProp(`${interval}PriceChange`)) <=
                0.0001
              ? roundTo7DP(
                  Number(getCoinProp("price")) -
                    Number(getCoinProp(`${interval}PriceChange`))
                )
              : roundTo3DP(
                  Number(getCoinProp("price")) -
                    Number(getCoinProp(`${interval}PriceChange`))
                )}
          </div>
        </div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>price chng</div>
          <div
            className={
              styles.tableCellRight +
              " " +
              `${
                getCoinProp(`${interval}PriceChange`) < 0
                  ? styles.red
                  : styles.green
              }`
            }
          >
            {appCurrencySign}
            {Number(getCoinProp(`${interval}PriceChange`)) >= 100 ||
            Number(getCoinProp(`${interval}PriceChange`)) <= -100
              ? roundTo2DP(getCoinProp(`${interval}PriceChange`))
              : Number(getCoinProp(`${interval}PriceChange`)) <= 0.0001 &&
                Number(getCoinProp(`${interval}PriceChange`)) >= -0.0001
              ? Number(getCoinProp(`${interval}PriceChange`)).toExponential(2)
              : roundTo3DP(getCoinProp(`${interval}PriceChange`))}
            {getCoinProp(`${interval}PriceChange`) < 0 ? (
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
                getCoinProp(`${interval}PriceChangePct`) < 0
                  ? styles.red
                  : styles.green
              }`
            }
          >
            {getCoinProp(`${interval}PriceChangePct`) >= 1000
              ? numAbbreviation(getCoinProp(`${interval}PriceChangePct`), 0)
              : roundTo2DP(getCoinProp(`${interval}PriceChangePct`))}
            %
            {getCoinProp(`${interval}PriceChangePct`) < 0 ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUp size={16} />
            )}
          </div>
        </div>
        {/* volume */}
        <div className={styles.marketSubHeading}>volume</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>
            {`${intervalLabel}`} volume
          </div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {numAbbreviation(getCoinProp(`${interval}Volume`), 2)}
          </div>
          <div className={styles.tableCellLeft}>
            prev {`${intervalLabel}`} vol.
          </div>
          <div className={styles.tableCellRight}>
            {appCurrencySign}
            {numAbbreviation(
              Number(getCoinProp(`${interval}Volume`)) -
                Number(getCoinProp(`${interval}VolumeChange`)),
              2
            )}
          </div>
        </div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>vol. chng</div>
          <div
            className={
              styles.tableCellRight +
              " " +
              `${
                getCoinProp(`${interval}VolumeChange`) < 0
                  ? styles.red
                  : styles.green
              }`
            }
          >
            {appCurrencySign}
            {numAbbreviation(getCoinProp(`${interval}VolumeChange`), 2)}
            {getCoinProp(`${interval}VolumeChange`) < 0 ? (
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
                getCoinProp(`${interval}VolumeChangePct`) < 0
                  ? styles.red
                  : styles.green
              }`
            }
          >
            {getCoinProp(`${interval}VolumeChangePct`) >= 1000
              ? numAbbreviation(getCoinProp(`${interval}VolumeChangePct`), 0)
              : roundTo2DP(getCoinProp(`${interval}VolumeChangePct`))}
            %
            {getCoinProp(`${interval}VolumeChangePct`) < 0 ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUp size={16} />
            )}
          </div>
        </div>
      </motion.div>
      {/* market data */}
      <motion.div
        className={styles.marketHeading}
        onClick={toggleShowMarketData}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.span
          animate={
            showMrktData
              ? { transform: "rotateX(180deg)" }
              : { transform: "rotateX(0deg)" }
          }
          transition={{ duration: 0.5 }}
          initial={false}
        >
          <ChevronDown />
        </motion.span>
        market data
      </motion.div>
      <motion.div
        className={styles.collapsibleLayout}
        animate={showMrktData ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.5 }}
        initial={false}
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
            {numAbbreviation(getCoinProp("marketCap"), 2)}
          </div>
          <div className={styles.tableCellLeft}>market cap rank</div>
          <div className={styles.tableCellRight}>{getCoinProp("rank")}</div>
        </div>
        {/* supply */}
        <div className={styles.marketSubHeading}>supply</div>
        <div className={styles.analysisLayout}>
          <div className={styles.tableCellLeft}>current supply</div>
          <div className={styles.tableCellRight}>
            {numAbbreviation(getCoinProp("supply"), 2)}
          </div>
          <div className={styles.tableCellLeft}>max supply</div>
          <div className={styles.tableCellRight}>
            {numAbbreviation(getCoinProp("maxSupply"), 2)}
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
  const mrktInfoSettings = await getMrktInfoSettings();

  // console.log(coin);
  // console.log(mrktInfoSettings);

  return {
    props: {
      coin,
      mrktInfoSettings,
    },
  };
}

export default Coin;
