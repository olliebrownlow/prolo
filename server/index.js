const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const cookies = require("cookies-next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const appSettingsFilePath = "./appSettings.json";
const coinFilePath = "./coinData.json";
const fiatFilePath = "./fiatData.json";
const fundingFilePath = "./fundingData.json";
const noteFilePath = "./noteData.json";
const userFilePath = "./userData.json";
const portfolioFilePath = "./portfolioData.json";
const autoNumberFilePath = "./autoNumber.json";
fs = require("fs");
path = require("path");
const appSettingsData = require(appSettingsFilePath);
const coinData = require(coinFilePath);
const fiatData = require(fiatFilePath);
const fundingData = require(fundingFilePath);
const noteData = require(noteFilePath);
const userData = require(userFilePath);
const portfolioData = require(portfolioFilePath);
const autoNumberData = require(autoNumberFilePath);

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.get("/api/v1/isAUser", (req, res) => {
    let user = req.query.user;

    const existingUser = userData.find((userData) => userData.user === user);

    if (existingUser) {
      return res.json("true");
    } else {
      return res.json("false");
    }
  });

  server.get("/api/v1/userNumber", (req, res) => {
    let userExists = req.query.userExists;
    let user = req.query.user;

    if (userExists === "true") {
      const existingUser = userData.find((userData) => userData.user === user);
      return res.json(existingUser.userNumber);
    }

    const newUserNumber = autoNumberData[0].nextUserNumber;

    const newUser = {
      userNumber: newUserNumber,
      user: user,
    };
    userData.push(newUser);

    autoNumberData[0].nextUserNumber = newUserNumber + 1;

    const pathToUserFile = path.join(__dirname, userFilePath);
    const stringifiedUserData = JSON.stringify(userData, null, 2);
    fs.writeFile(pathToUserFile, stringifiedUserData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    const pathToAutoNumberFile = path.join(__dirname, autoNumberFilePath);
    const stringifiedAutoNumberData = JSON.stringify(autoNumberData, null, 2);
    fs.writeFile(pathToAutoNumberFile, stringifiedAutoNumberData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    return res.json(newUserNumber);
  });

  server.get("/api/v1/portfolioData", (req, res) => {
    let userExists = req.query.userExists;
    let userNumber = parseInt(req.query.userNumber);

    if (userExists === "true") {
      const settingsForUser = appSettingsData.find(
        (settings) => settings.userNumber === userNumber
      );
      const portfolio = portfolioData.find(
        (portfolio) =>
          portfolio.portfolioNumber === settingsForUser.currentPortfolioNumber
      );
      return res.json({
        portfolioNumber: settingsForUser.currentPortfolioNumber,
        portfolioName: portfolio.portfolioName,
      });
    }

    const newPortfolioNumber = autoNumberData[0].nextPortfolioNumber;

    const newPortfolio = {
      userNumber: userNumber,
      portfolioName: "main",
      portfolioNumber: newPortfolioNumber,
      portfolioDescription: "",
    };
    portfolioData.push(newPortfolio);

    autoNumberData[0].nextPortfolioNumber = newPortfolioNumber + 1;

    const pathToPortfolioFile = path.join(__dirname, portfolioFilePath);
    const stringifiedPortfolioData = JSON.stringify(portfolioData, null, 2);
    fs.writeFile(pathToPortfolioFile, stringifiedPortfolioData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    const pathToAutoNumberFile = path.join(__dirname, autoNumberFilePath);
    const stringifiedAutoNumberData = JSON.stringify(autoNumberData, null, 2);
    fs.writeFile(pathToAutoNumberFile, stringifiedAutoNumberData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    return res.json(newPortfolioNumber);
  });

  server.get("/api/v1/portfolioNumber", (req, res) => {
    const newPortfolioNumber = autoNumberData[0].nextPortfolioNumber;

    autoNumberData[0].nextPortfolioNumber = newPortfolioNumber + 1;

    const pathToAutoNumberFile = path.join(__dirname, autoNumberFilePath);
    const stringifiedAutoNumberData = JSON.stringify(autoNumberData, null, 2);
    fs.writeFile(pathToAutoNumberFile, stringifiedAutoNumberData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    return res.json(newPortfolioNumber);
  });

  server.get("/api/v1/userName", (req, res) => {
    let userNumber = parseInt(req.query.userNumber);

    const result = userData.find((user) => user.userNumber === userNumber);
    return res.json(result.user);
  });

  server.post("/api/v1/appSettings", (req, res) => {
    const userNumber = req.body.userNumber;
    const portfolioNumber = req.body.portfolioNumber;
    if (
      appSettingsData.find((settings) => settings.userNumber === userNumber)
    ) {
      return res.json(
        `Cannot add new app settings for user: user already exists`
      );
    }

    const defaultAppSettingsForNewUser = {
      theme: "dark",
      currencyCode: "eur",
      currencyName: "euros",
      sign: "€",
      showFiatNotepad: false,
      showCoinNotepad: false,
      showFundingItemNotepad: false,
      showMrktAnalysis: false,
      showMrktData: false,
      currentIndex: 0,
      interval: "h",
      intervalLabel: "1hr",
      metricOneMonitor: "rank",
      metricTwoMonitor: "ath",
      orderByMonitor: "name",
      directionMonitor: "descending",
      userNumber: userNumber,
      currentPortfolioNumber: portfolioNumber,
    };
    appSettingsData.push(defaultAppSettingsForNewUser);

    const pathToFile = path.join(__dirname, appSettingsFilePath);
    const stringifiedData = JSON.stringify(appSettingsData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
      return res.json(`new app settings successfully added for ${user}`);
    });
  });

  server.get("/api/v1/appSettings", (req, res) => {
    let userNumber = parseInt(req.query.userNumber);
    let concept = req.query.concept;

    if (req.query.userNumber === undefined) {
      userNumber = parseInt(cookies.getCookie("un", { req, res }));
      concept = "themeAndCurrency";
    }

    const allSettings = appSettingsData.find(
      (settings) => settings.userNumber === userNumber
    );

    let settings;
    if (concept === "themeAndCurrency") {
      settings = _.pick(allSettings, [
        "theme",
        "currencyCode",
        "currencyName",
        "sign",
      ]);
    } else if (concept === "mrktInfoSettings") {
      settings = _.pick(allSettings, [
        "showMrktAnalysis",
        "showMrktData",
        "currentIndex",
        "interval",
        "intervalLabel",
      ]);
    } else if (concept === "notepadSettings") {
      settings = _.pick(allSettings, [
        "showFiatNotepad",
        "showCoinNotepad",
        "showFundingItemNotepad",
      ]);
    } else if (concept === "orderBySettings") {
      settings = _.pick(allSettings, [
        "metricOneMonitor",
        "orderByMonitor",
        "metricTwoMonitor",
        "directionMonitor",
      ]);
    }

    return res.json(settings);
  });

  server.patch("/api/v1/appSettings", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);
    const newSettings = req.body.newSettings;
    const allSettings = appSettingsData.find(
      (settings) => settings.userNumber === userNumber
    );

    _.merge(allSettings, newSettings);

    const pathToFile = path.join(__dirname, appSettingsFilePath);
    const stringifiedData = JSON.stringify(appSettingsData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      if (newSettings.theme) {
        return res.json(`App theme set to ${newSettings.theme}`);
      } else if (newSettings.currencyName) {
        return res.json(`App currency set to ${newSettings.currencyName}`);
      } else if (newSettings.intervalLabel) {
        return res.json(`Interval set to ${newSettings.intervalLabel}`);
      } else if (typeof newSettings.showMrktAnalysis === "boolean") {
        return res.json(
          `Show market analysis data set to ${newSettings.showMrktAnalysis}`
        );
      } else if (typeof newSettings.showMrktData === "boolean") {
        return res.json(
          `Show market info data set to ${newSettings.showMrktData}`
        );
      } else if (newSettings.orderByMonitor) {
        return res.json("Monitor page settngs updated");
      } else {
        return res.json("Notepad visibilty updated");
      }
    });
  });

  // post method to fetch all portfolios for a specific user
  server.post("/api/v1/allPortfoliosForUser", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);
    const portfolios = _.filter(portfolioData, function (portfolio) {
      return portfolio.userNumber === userNumber;
    });
    return res.json(portfolios);
  });

  server.post("/api/v1/portfolios", (req, res) => {
    const portfolio = req.body;
    if (
      portfolioData.find(
        (savedPortfolio) =>
          savedPortfolio.portfolioNumber === portfolio.portfolioNumber
      )
    ) {
      return res.json("Cannot add portfolio: already added");
    }
    portfolioData.push(portfolio);
    const pathToFile = path.join(__dirname, portfolioFilePath);
    const stringifiedData = JSON.stringify(portfolioData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `portfolio with name ${portfolio.portfolioName} successfully added`
      );
    });
  });

  server.patch("/api/v1/portfolios", (req, res) => {
    const updatedPortfolio = req.body;
    const portfolioIndex = portfolioData.findIndex(
      (portfolio) =>
        portfolio.portfolioNumber === updatedPortfolio.portfolioNumber
    );
    const currentPortfolio = portfolioData[portfolioIndex];

    if (
      currentPortfolio.portfolioName === updatedPortfolio.portfolioName &&
      currentPortfolio.portfolioDescription ===
        updatedPortfolio.portfolioDescription
    ) {
      return res.send(404, {
        error: "Cannot update portfolio: already updated",
      });
    }

    portfolioData[portfolioIndex] = updatedPortfolio;

    const pathToFile = path.join(__dirname, portfolioFilePath);
    const stringifiedData = JSON.stringify(portfolioData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("portfolio successfully updated");
    });
  });

  server.delete("/api/v1/portfolios/:id", (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const portfolioCount = req.body.portfolioCount;
    const portfolioIndex = portfolioData.findIndex(
      (portfolio) => portfolio.portfolioNumber === id
    );

    if (portfolioIndex < 0) {
      return res.json("portfolio already deleted");
    }

    if (portfolioCount < 2) {
      return res.json("cannot delete: you must have at least one portfolio");
    }

    const dataTypes = [
      coinData,
      fiatData,
      fundingData,
      noteData,
      portfolioData,
    ];

    dataTypes.forEach((dataType) =>
      _.pullAllBy(dataType, [{ portfolioNumber: id }], "portfolioNumber")
    );

    // Todo: rollback function in case any writes to file error out
    const pathToCoinFile = path.join(__dirname, coinFilePath);
    const stringifiedCoinData = JSON.stringify(coinData, null, 2);
    fs.writeFile(pathToCoinFile, stringifiedCoinData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToFiatFile = path.join(__dirname, fiatFilePath);
    const stringifiedFiatData = JSON.stringify(fiatData, null, 2);
    fs.writeFile(pathToFiatFile, stringifiedFiatData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToFundingFile = path.join(__dirname, fundingFilePath);
    const stringifiedFundingData = JSON.stringify(fundingData, null, 2);
    fs.writeFile(pathToFundingFile, stringifiedFundingData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToNoteFile = path.join(__dirname, noteFilePath);
    const stringifiedNoteData = JSON.stringify(noteData, null, 2);
    fs.writeFile(pathToNoteFile, stringifiedNoteData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToPortfolioFile = path.join(__dirname, portfolioFilePath);
    const stringifiedPortfolioData = JSON.stringify(portfolioData, null, 2);
    fs.writeFile(pathToPortfolioFile, stringifiedPortfolioData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    return res.json("portfolio deleted");
  });

  // post method to fetch all investmentItems on a specific user's specific portfolio
  server.post("/api/v1/investmentItems", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const investmentItems = _.filter(fundingData, function (item) {
      return (
        item.userNumber === userNumber &&
        item.portfolioNumber === portfolioNumber
      );
    });
    return res.json(investmentItems);
  });

  // post method to fetch all investmentItems for a specific user
  server.post("/api/v1/allInvestmentItems", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);
    const investmentItems = _.filter(fundingData, function (item) {
      return item.userNumber === userNumber;
    });
    return res.json(investmentItems);
  });

  // post method to fetch a specific investment item for a specific user
  server.post("/api/v1/investmentItem", (req, res) => {
    const itemId = req.body.id;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const item = fundingData.find(
      (savedItem) =>
        savedItem.id === itemId &&
        savedItem.userNumber === userNumber &&
        savedItem.portfolioNumber === portfolioNumber
    );

    return res.json(item);
  });

  server.post("/api/v1/fundingHistory", (req, res) => {
    const item = req.body;
    if (
      fundingData.find(
        (savedItem) =>
          savedItem.date === item.date &&
          savedItem.currencyCode === item.currencyCode &&
          savedItem.userNumber === item.userNumber &&
          savedItem.portfolioNumber === item.portfolioNumber
      )
    ) {
      return res.json(
        "cannot add funding item: item with the same date and currency already exists. try joining with it."
      );
    }
    fundingData.push(item);

    const pathToFile = path.join(__dirname, fundingFilePath);
    const stringifiedData = JSON.stringify(fundingData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `${item.amount} ${item.currencyCode} ${item.type} successfully added`
      );
    });
  });

  server.patch("/api/v1/fundingHistory/:id", (req, res) => {
    const { id } = req.params;
    const correctedItem = req.body;
    const itemIndex = fundingData.findIndex(
      (item) =>
        item.id === id &&
        item.userNumber === parseInt(correctedItem.userNumber) &&
        item.portfolioNumber === parseInt(correctedItem.portfolioNumber)
    );

    if (
      fundingData[itemIndex].id === correctedItem.id &&
      fundingData[itemIndex].amount === correctedItem.amount &&
      fundingData[itemIndex].type === correctedItem.type &&
      fundingData[itemIndex].date === correctedItem.date
    ) {
      return res.json(
        "Cannot update funding item. It has been updated already"
      );
    }
    fundingData[itemIndex] = correctedItem;

    const pathToFile = path.join(__dirname, fundingFilePath);
    const stringifiedData = JSON.stringify(fundingData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `Funding item updated:\namount = ${correctedItem.amount}\ntype = ${correctedItem.type}\ndate = ${correctedItem.date}`
      );
    });
  });

  server.delete("/api/v1/fundingHistory/:id", (req, res) => {
    const { id } = req.params;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const itemIndex = fundingData.findIndex(
      (item) =>
        item.id === id &&
        item.userNumber === userNumber &&
        item.portfolioNumber === portfolioNumber
    );

    if (itemIndex < 0) {
      return res.json("Funding item already deleted");
    }

    const amount = fundingData[itemIndex].amount;
    const type = fundingData[itemIndex].type;
    const code = fundingData[itemIndex].currencyCode;

    fundingData.splice(itemIndex, 1);

    const pathToFile = path.join(__dirname, fundingFilePath);
    const stringifiedData = JSON.stringify(fundingData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`${amount} ${code} ${type} deleted`);
    });
  });

  // post method to fetch all coins for a specific user
  server.post("/api/v1/allCoins", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const type = req.body.type;
    const coins = _.filter(coinData, function (coin) {
      return (
        coin.userNumber === userNumber &&
        coin.portfolioNumber === portfolioNumber &&
        coin.type === type
      );
    });
    return res.json(coins);
  });

  // post method to fetch a specific coin for a specific user
  server.post("/api/v1/coin", (req, res) => {
    const coinCode = req.body.code;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const type = req.body.type;
    const coin = coinData.find(
      (savedCoin) =>
        savedCoin.code === coinCode &&
        savedCoin.userNumber === userNumber &&
        savedCoin.portfolioNumber === portfolioNumber &&
        savedCoin.type === type
    );

    return res.json(coin);
  });

  server.post("/api/v1/coins", (req, res) => {
    const coin = req.body;
    if (
      coinData.find(
        (savedCoin) =>
          savedCoin.code === coin.code &&
          savedCoin.userNumber === coin.userNumber &&
          savedCoin.portfolioNumber === coin.portfolioNumber &&
          savedCoin.type === coin.type
      )
    ) {
      return res.json("Cannot add coin: already added");
    }
    coinData.push(coin);
    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      if (coin.amount) {
        return res.json(`${coin.amount} ${coin.name} successfully added`);
      } else {
        return res.json(`${coin.name} successfully added for monitoring`);
      }
    });
  });

  server.patch("/api/v1/coins/:id", (req, res) => {
    const { id } = req.params;
    const updatedAmount = req.body.amount;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const type = req.body.type;
    const coinIndex = coinData.findIndex(
      (coin) =>
        coin.code === id &&
        coin.userNumber === userNumber &&
        coin.portfolioNumber === portfolioNumber &&
        coin.type === type
    );

    if (coinData[coinIndex].amount === updatedAmount) {
      return res.json("Cannot update coin: aleady updated");
    }
    coinData[coinIndex].amount = updatedAmount;

    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `${coinData[coinIndex].name} amount updated to ${updatedAmount}`
      );
    });
  });

  server.delete("/api/v1/coins/:id", (req, res) => {
    const { id } = req.params;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const type = req.body.type;
    const coinIndex = coinData.findIndex(
      (coin) =>
        coin.code === id &&
        coin.userNumber === userNumber &&
        coin.portfolioNumber === portfolioNumber &&
        coin.type === type
    );

    if (coinIndex < 0) {
      return res.json("Coin already deleted");
    }

    const coinName = coinData[coinIndex].name;

    coinData.splice(coinIndex, 1);

    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`${coinName} successfully deleted`);
    });
  });

  // post method to fetch all fiats for a specific user
  server.post("/api/v1/allFiats", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);

    const fiats = _.filter(fiatData, function (fiat) {
      return (
        fiat.userNumber === userNumber &&
        fiat.portfolioNumber === portfolioNumber
      );
    });
    return res.json(fiats);
  });

  // post method to fetch a specific fiat
  server.post("/api/v1/singleFiat", (req, res) => {
    const fiatCode = req.body.code;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const fiat = fiatData.find(
      (savedFiat) =>
        savedFiat.code === fiatCode &&
        savedFiat.userNumber === userNumber &&
        savedFiat.portfolioNumber === portfolioNumber
    );

    return res.json(fiat);
  });

  server.post("/api/v1/fiat", (req, res) => {
    const fiat = req.body;
    if (
      fiatData.find(
        (savedFiat) =>
          savedFiat.code === fiat.code &&
          savedFiat.userNumber === fiat.userNumber &&
          savedFiat.portfolioNumber === fiat.portfolioNumber
      )
    ) {
      return res.json("Cannot add fiat currency: already added");
    }
    fiatData.push(fiat);
    const pathToFile = path.join(__dirname, fiatFilePath);
    const stringifiedData = JSON.stringify(fiatData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`${fiat.amount} ${fiat.code} successfully added`);
    });
  });

  server.patch("/api/v1/fiat/:id", (req, res) => {
    const { id } = req.params;
    const updatedAmount = req.body.amount;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);
    const fiatIndex = fiatData.findIndex(
      (fiat) =>
        fiat.code === id &&
        fiat.userNumber === userNumber &&
        fiat.portfolioNumber === portfolioNumber
    );

    if (fiatData[fiatIndex].amount === updatedAmount) {
      return res.json("Cannot update fiat currency: already updated");
    }
    fiatData[fiatIndex].amount = updatedAmount;

    const pathToFile = path.join(__dirname, fiatFilePath);
    const stringifiedData = JSON.stringify(fiatData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `${fiatData[fiatIndex].code} amount updated to ${updatedAmount}`
      );
    });
  });

  server.delete("/api/v1/fiat/:id", (req, res) => {
    const { id } = req.params;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.userNumber);
    const fiatIndex = fiatData.findIndex(
      (fiat) =>
        fiat.code === id &&
        fiat.userNumber === userNumber &&
        fiat.portfolioNumber === portfolioNumber
    );

    if (fiatIndex < 0) {
      return res.json(`cannot remove ${id} holdings: already deleted`);
    }

    fiatData.splice(fiatIndex, 1);

    const pathToFile = path.join(__dirname, fiatFilePath);
    const stringifiedData = JSON.stringify(fiatData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`${id} holding successfully deleted`);
    });
  });

  // gets notes for a specific user, for a specific entity id in a specific portfolio
  server.post("/api/v1/notes", (req, res) => {
    const code = req.body.code;
    const userNumber = parseInt(req.body.userNumber);
    const portfolioNumber = parseInt(req.body.portfolioNumber);

    const filteredNoteData = noteData.filter(
      (note) =>
        note.userNumber === userNumber &&
        note.portfolioNumber === portfolioNumber &&
        note.code === code
    );
    return res.json(filteredNoteData);
  });

  server.post("/api/v1/allNotes", (req, res) => {
    const note = req.body;
    noteData.push(note);
    const pathToFile = path.join(__dirname, noteFilePath);
    const stringifiedData = JSON.stringify(noteData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Note successfully added");
    });
  });

  server.patch("/api/v1/notes/:id", (req, res) => {
    const { id } = req.params;
    const updatedNote = req.body;
    const noteIndex = noteData.findIndex((note) => note.id === id);
    const currentNote = noteData[noteIndex];

    if (
      currentNote.noteTitle === updatedNote.noteTitle &&
      currentNote.noteContent === updatedNote.noteContent
    ) {
      return res.send(404, {
        error: "Cannot update note: already updated",
      });
    }

    noteData[noteIndex] = updatedNote;

    const pathToFile = path.join(__dirname, noteFilePath);
    const stringifiedData = JSON.stringify(noteData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Note successfully updated");
    });
  });

  server.delete("/api/v1/notes/:id", (req, res) => {
    const { id } = req.params;
    const noteIndex = noteData.findIndex((note) => note.id === id);

    if (noteIndex < 0) {
      return res.json("Note already deleted");
    }

    noteData.splice(noteIndex, 1);

    const pathToFile = path.join(__dirname, noteFilePath);
    const stringifiedData = JSON.stringify(noteData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Note successfully deleted");
    });
  });

  server.delete("/api/v1/allNotes", (req, res) => {
    const noteListArray = req.body.noteListArray;

    const noteIdArray = noteListArray.map((note) => {
      return note.id;
    });

    if (noteIdArray.length === 0) {
      return res.json("No notes to delete");
    }

    _.remove(noteData, function (note) {
      return noteIdArray.includes(note.id);
    });

    const pathToFile = path.join(__dirname, noteFilePath);
    const stringifiedData = JSON.stringify(noteData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`${noteIdArray.length} associated notes deleted`);
    });
  });

  server.delete("/api/v1/account", (req, res) => {
    const userNumber = parseInt(req.body.userNumber);

    if (userNumber <= 1 || userNumber === undefined) {
      return res.json(
        "cannot delete account: user protected or no user detected"
      );
    }

    const dataTypes = [
      coinData,
      fiatData,
      fundingData,
      noteData,
      appSettingsData,
      userData,
      portfolioData,
    ];

    dataTypes.forEach((dataType) =>
      _.pullAllBy(dataType, [{ userNumber: userNumber }], "userNumber")
    );

    // Todo: rollback function in case any writes to file error out
    const pathToCoinFile = path.join(__dirname, coinFilePath);
    const stringifiedCoinData = JSON.stringify(coinData, null, 2);
    fs.writeFile(pathToCoinFile, stringifiedCoinData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToFiatFile = path.join(__dirname, fiatFilePath);
    const stringifiedFiatData = JSON.stringify(fiatData, null, 2);
    fs.writeFile(pathToFiatFile, stringifiedFiatData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToFundingFile = path.join(__dirname, fundingFilePath);
    const stringifiedFundingData = JSON.stringify(fundingData, null, 2);
    fs.writeFile(pathToFundingFile, stringifiedFundingData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToNoteFile = path.join(__dirname, noteFilePath);
    const stringifiedNoteData = JSON.stringify(noteData, null, 2);
    fs.writeFile(pathToNoteFile, stringifiedNoteData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToAppSettingsFile = path.join(__dirname, appSettingsFilePath);
    const stringifiedAppSettingsData = JSON.stringify(appSettingsData, null, 2);
    fs.writeFile(pathToAppSettingsFile, stringifiedAppSettingsData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToUserFile = path.join(__dirname, userFilePath);
    const stringifiedUserData = JSON.stringify(userData, null, 2);
    fs.writeFile(pathToUserFile, stringifiedUserData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });
    const pathToPortfolioFile = path.join(__dirname, portfolioFilePath);
    const stringifiedPortfolioData = JSON.stringify(portfolioData, null, 2);
    fs.writeFile(pathToPortfolioFile, stringifiedPortfolioData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }
    });

    return res.json("account deleted");
  });

  // we are handling all of the requests coming to our server
  server.get("*", (req, res) => {
    // next.js is handling requests and providing the pages we are navigating to
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("> Ready on port " + PORT);
  });
});
