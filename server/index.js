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
fs = require("fs");
path = require("path");
const appSettingsData = require(appSettingsFilePath);
const coinData = require(coinFilePath);
const fiatData = require(fiatFilePath);
const fundingData = require(fundingFilePath);
const noteData = require(noteFilePath);

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.get("/api/v1/hasAppSettings", (req, res) => {
    const user = cookies.getCookie("ue", { req, res });
    const settings = appSettingsData.find((settings) => settings.user === user);
    if (settings) {
      return res.json("true");
    } else {
      return res.json("false");
    }
  });

  server.post("/api/v1/appSettings", (req, res) => {
    const user = req.body.user;
    if (appSettingsData.find((settings) => settings.user === user)) {
      return res.json(
        `Cannot add new app settings for ${user}: user already exists`
      );
    }
    const defaultAppSettingsForNewUser = {
      theme: "light",
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
      user: user,
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
    let user = req.query.user;
    let concept = req.query.concept;

    if (req.query.user === undefined) {
      user = cookies.getCookie("ue", { req, res });
      concept = "themeAndCurrency";
    }

    const allSettings = appSettingsData.find(
      (settings) => settings.user === user
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
    }

    return res.json(settings);
  });

  server.patch("/api/v1/appSettings", (req, res) => {
    const user = req.body.user;
    const newSettings = req.body.newSettings;
    const allSettings = appSettingsData.find(
      (settings) => settings.user === user
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
      } else if (newSettings.showMrktAnalysis) {
        return res.json(
          `Show market analysis data set to ${newSettings.showMrktAnalysis}`
        );
      } else if (newSettings.showMrktData) {
        return res.json(
          `Show market info data set to ${newSettings.showMrktData}`
        );
      } else {
        return res.json("Notepad visibilty updated");
      }
    });
  });

  // post method to fetch all investmentItems for a specific user
  server.post("/api/v1/investmentItems", (req, res) => {
    const user = req.body.user;
    const investmentItems = _.filter(fundingData, function (item) {
      return item.user === user;
    });
    return res.json(investmentItems);
  });

  // post method to fetch a specific investment item for a specific user
  server.post("/api/v1/investmentItem", (req, res) => {
    const itemId = req.body.id;
    const user = req.body.user;
    const item = fundingData.find(
      (savedItem) => savedItem.id === itemId && savedItem.user === user
    );

    return res.json(item);
  });

  server.post("/api/v1/fundingHistory", (req, res) => {
    const item = req.body;
    if (
      fundingData.find(
        (savedItem) =>
          savedItem.date === item.date &&
          savedItem.type === item.type &&
          savedItem.currencyCode === item.currencyCode
      )
    ) {
      return res.json(
        "Cannot add funding item. It has either been added already or you should add it to the existing item of the same date, type and currency"
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
      (item) => item.id === id && item.user === correctedItem.user
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
    const user = req.body.user;
    const itemIndex = fundingData.findIndex(
      (item) => item.id === id && item.user === user
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
    const user = req.body.user;
    const type = req.body.type;
    const coins = _.filter(coinData, function (coin) {
      return coin.user === user && coin.type === type;
    });
    return res.json(coins);
  });

  // post method to fetch a specific coin for a specific user
  server.post("/api/v1/coin", (req, res) => {
    const coinCode = req.body.code;
    const user = req.body.user;
    const type = req.body.type;
    const coin = coinData.find(
      (savedCoin) =>
        savedCoin.code === coinCode &&
        savedCoin.user === user &&
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
          savedCoin.user === coin.user &&
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
    const user = req.body.user;
    const type = req.body.type;
    const coinIndex = coinData.findIndex(
      (coin) => coin.code === id && coin.user === user && coin.type === type
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
    const user = req.body.user;
    const type = req.body.type;
    const coinIndex = coinData.findIndex(
      (coin) => coin.code === id && coin.user === user && coin.type === type
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
    const user = req.body.user;

    const fiats = _.filter(fiatData, function (fiat) {
      return fiat.user === user;
    });
    return res.json(fiats);
  });

  // post method to fetch a specific fiat
  server.post("/api/v1/singleFiat", (req, res) => {
    const fiatCode = req.body.code;
    const user = req.body.user;
    const fiat = fiatData.find(
      (savedFiat) => savedFiat.code === fiatCode && savedFiat.user === user
    );

    return res.json(fiat);
  });

  server.post("/api/v1/fiat", (req, res) => {
    const fiat = req.body;
    if (
      fiatData.find(
        (savedFiat) =>
          savedFiat.code === fiat.code && savedFiat.user === fiat.user
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
    const user = req.body.user;
    const fiatIndex = fiatData.findIndex(
      (fiat) => fiat.code === id && fiat.user === user
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
    const user = req.body.user;
    const fiatIndex = fiatData.findIndex(
      (fiat) => fiat.code === id && fiat.user === user
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

  // gets notes for a specific user, for a specific entity id
  server.post("/api/v1/notes", (req, res) => {
    const code = req.body.code;
    const user = req.body.user;

    const filteredNoteData = noteData.filter(
      (note) => note.user === user && note.code === code
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

  // we are handling all of the requests coming to our server
  server.get("*", (req, res) => {
    // next.js is handling requests and providing pages where we are navigating to
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("> Ready on port " + PORT);
  });
});
