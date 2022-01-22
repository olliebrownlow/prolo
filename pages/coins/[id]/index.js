import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../lib/UserContext";
import CurrencySettingsContext from "../../../context/currencySettings";
import {
  getNotes,
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
import NoteCollapsible from "../../../components/note-collapsible";
import DetailPageButtons from "../../../components/detail-page-buttons";
import MrktInfoRow from "../../../components/mrkt-info-row";
import styles from "../../../pageStyles/dynamicPage.module.scss";
import { RefreshCw, ChevronDown } from "react-feather";
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
  const [user] = useContext(UserContext);
  const { appCurrencySign } = useContext(CurrencySettingsContext);
  const { coin, mrktInfoSettings, roundTo2DP } = props;

  const [noteList, setNoteList] = useState([]);
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
  const [currentIndex, setCurrentIndex] = useState(
    mrktInfoSettings[0].currentIndex
  );
  const [interval, setInterval] = useState(mrktInfoSettings[0].interval);
  const [intervalLabel, setIntervalLabel] = useState(
    mrktInfoSettings[0].intervalLabel
  );

  useEffect(async () => {
    const noteFilter = {
      user: user.email,
      code: coin[0].id,
    };
    const notes = await getNotes(noteFilter);
    setNoteList(notes);
  }, [coin, user]);

  // alternative to using a switch statement
  const matched = (x) => ({
    on: () => matched(x),
    otherwise: () => x,
  });
  const match = (x) => ({
    on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
    otherwise: (fn) => fn(x),
  });

  const setAndStore = (index, propPrefix, intervalDescription) => {
    setInterval(propPrefix);
    setIntervalLabel(intervalDescription);
    const newInfoSettings = [
      {
        currentIndex: index,
        interval: propPrefix,
        intervalLabel: intervalDescription,
      },
    ];
    const res = updateMrktInfoSettings(newInfoSettings);
    console.log(res);
  };

  const handleIndexChange = (x) => {
    setCurrentIndex(x);
    match(x)
      .on(
        (x) => x === 0,
        () => setAndStore(x, "h", "1hr")
      )
      .on(
        (x) => x === 1,
        () => setAndStore(x, "d", "1d")
      )
      .on(
        (x) => x === 2,
        () => setAndStore(x, "w", "1w")
      )
      .on(
        (x) => x === 3,
        () => setAndStore(x, "m", "1m")
      )
      .on(
        (x) => x === 4,
        () => setAndStore(x, "y", "1yr")
      )
      .on(
        (x) => x === 5,
        () => setAndStore(x, "ytd", "ytd")
      );
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
          `${
            getCoinProp("name") === "polkadot" ||
            getCoinProp("name") === "fantom"
              ? styles.withBackground
              : ""
          }`
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
      <div className={styles.currentAmount}>{currentAmount} coins</div>
      <div className={styles.currentAmount}>{appCurrencySign}{roundTo2DP(getCoinProp("price"))}/coin</div>
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
      <NoteCollapsible
        data={getCoinProp("id")}
        notes={noteList}
        notepadSettingType={"showCoinFiatNotepad"}
      />
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
        <Interval currentIndex={currentIndex} onChange={handleIndexChange} />
        {/* price */}
        <div className={styles.marketSubHeading}>price</div>
        <MrktInfoRow
          key1={"price"}
          value1={`${appCurrencySign}${
            Number(getCoinProp("price")) >= 100
              ? roundTo2DP(getCoinProp("price"))
              : Number(getCoinProp("price")) <= 0.0001
              ? roundTo7DP(getCoinProp("price"))
              : roundTo3DP(getCoinProp("price"))
          }`}
          key2={`price at ${intervalLabel}`}
          value2={`${appCurrencySign}${
            Number(getCoinProp("price")) -
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
                )
          }`}
        />
        <MrktInfoRow
          key1={"price chng"}
          value1={`${
            Number(getCoinProp(`${interval}PriceChange`)) >= 100 ||
            Number(getCoinProp(`${interval}PriceChange`)) <= -100
              ? roundTo2DP(getCoinProp(`${interval}PriceChange`))
              : Number(getCoinProp(`${interval}PriceChange`)) <= 0.0001 &&
                Number(getCoinProp(`${interval}PriceChange`)) >= -0.0001
              ? Number(getCoinProp(`${interval}PriceChange`)).toExponential(2)
              : roundTo3DP(getCoinProp(`${interval}PriceChange`))
          }`}
          key2={"price chng %"}
          value2={`${
            getCoinProp(`${interval}PriceChangePct`) >= 1000
              ? numAbbreviation(getCoinProp(`${interval}PriceChangePct`), 0)
              : roundTo2DP(getCoinProp(`${interval}PriceChangePct`))
          }`}
          percentage={true}
          withArrow={true}
          withAppCurrencySign={true}
        />
        {/* volume */}
        <div className={styles.marketSubHeading}>volume</div>
        <MrktInfoRow
          key1={`${intervalLabel} volume`}
          value1={`${appCurrencySign}${numAbbreviation(
            getCoinProp(`${interval}Volume`),
            2
          )}`}
          key2={`prev ${intervalLabel} vol.`}
          value2={`${appCurrencySign}${numAbbreviation(
            Number(getCoinProp(`${interval}Volume`)) -
              Number(getCoinProp(`${interval}VolumeChange`)),
            2
          )}`}
        />
        <MrktInfoRow
          key1={"vol. chng"}
          value1={numAbbreviation(getCoinProp(`${interval}VolumeChange`), 2)}
          key2={"vol. chng %"}
          value2={`${
            getCoinProp(`${interval}VolumeChangePct`) >= 1000
              ? numAbbreviation(getCoinProp(`${interval}VolumeChangePct`), 0)
              : roundTo2DP(getCoinProp(`${interval}VolumeChangePct`))
          }`}
          percentage={true}
          withArrow={true}
          withAppCurrencySign={true}
        />
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
        <MrktInfoRow
          key1={"price"}
          value1={`${appCurrencySign}${
            Number(getCoinProp("price")) >= 100
              ? roundTo2DP(getCoinProp("price"))
              : Number(getCoinProp("price")) <= 0.0001
              ? roundTo7DP(getCoinProp("price"))
              : roundTo3DP(getCoinProp("price"))
          }`}
          key2={"ath"}
          value2={`${appCurrencySign}${
            Number(getCoinProp("high")) >= 100
              ? roundTo2DP(getCoinProp("high"))
              : Number(getCoinProp("high")) <= 0.0001
              ? roundTo7DP(getCoinProp("high"))
              : roundTo3DP(getCoinProp("high"))
          }`}
        />
        <MrktInfoRow
          key1={"ath date"}
          value1={formatDate(getCoinProp("highDate"))}
          key2={"% ath"}
          value2={
            `${roundTo2DP(
              (getCoinProp("price") / getCoinProp("high")) * 100
            )}` + "%"
          }
        />
        {/* market capitalisation */}
        <div className={styles.marketSubHeading}>market capitalisation</div>
        <MrktInfoRow
          key1={"market cap"}
          value1={`${appCurrencySign}${numAbbreviation(
            getCoinProp("marketCap"),
            2
          )}`}
          key2={"market cap rank"}
          value2={getCoinProp("rank")}
        />
        {/* supply */}
        <div className={styles.marketSubHeading}>supply</div>
        <MrktInfoRow
          key1={"current supply"}
          value1={numAbbreviation(getCoinProp("supply"), 2)}
          key2={"max supply"}
          value2={numAbbreviation(getCoinProp("maxSupply"), 2)}
        />
        <MrktInfoRow
          key1={"supply %"}
          value1={circulationPercentage()}
          key2={"first trade"}
          value2={formatDate(getCoinProp("firstTrade"))}
        />
      </motion.div>
      <hr className={styles.solidDivider} />
      <DetailPageButtons
        showModal={showModal}
        handleDelete={handleDeleteCoin}
        handleCancel={handleCancel}
        isShown={isShown}
        deleted={deleted}
        cancel={cancel}
        buttonText={"update"}
      />
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
