const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const currencyFilePath = "./currencySettingsData.json";
const themeFilePath = "./themeSettingsData.json";
const coinFilePath = "./coinData.json";
const fiatFilePath = "./fiatData.json";
const fundingFilePath = "./fundingData.json";
const mrktInfoFilePath = "./marketInfoSettings.json";
const noteFilePath = "./noteData.json";
const notePadFilePath = "./showNotepadSettings.json";
fs = require("fs");
path = require("path");
const currencySettingsData = require(currencyFilePath);
const themeSettingsData = require(themeFilePath);
const coinData = require(coinFilePath);
const fiatData = require(fiatFilePath);
const fundingData = require(fundingFilePath);
const mrktInfoSettingsData = require(mrktInfoFilePath);
const noteData = require(noteFilePath);
const showNotepadSettingsData = require(notePadFilePath);

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.get("/api/v1/currencySettings", (req, res) => {
    return res.json(currencySettingsData);
  });

  server.patch("/api/v1/currencySettings", (req, res) => {
    const currency = req.body[0];

    currencySettingsData[0] = currency;

    const pathToFile = path.join(__dirname, currencyFilePath);
    const stringifiedData = JSON.stringify(currencySettingsData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`App currency successfully updated to ${currency}`);
    });
  });

  server.get("/api/v1/themeSettings", (req, res) => {
    return res.json(themeSettingsData);
  });

  server.patch("/api/v1/themeSettings", (req, res) => {
    const theme = req.body[0];

    themeSettingsData[0] = theme;

    const pathToFile = path.join(__dirname, themeFilePath);
    const stringifiedData = JSON.stringify(themeSettingsData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`Theme mode successfully updated to ${theme}`);
    });
  });

  server.get("/api/v1/mrktInfoSettings", (req, res) => {
    return res.json(mrktInfoSettingsData);
  });

  server.patch("/api/v1/mrktInfoSettings", (req, res) => {
    const newSettings = req.body[0];
    const newSettingsArray = Object.entries(newSettings);

    newSettingsArray.forEach((entry) => {
      let key = entry[0];
      let value = entry[1];
      mrktInfoSettingsData[0][key] = value;
    });

    const pathToFile = path.join(__dirname, mrktInfoFilePath);
    const stringifiedData = JSON.stringify(mrktInfoSettingsData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Market info settng(s) successfully updated");
    });
  });

  server.get("/api/v1/showNotepadSettings", (req, res) => {
    return res.json(showNotepadSettingsData);
  });

  server.patch("/api/v1/showNotepadSettings", (req, res) => {
    const newSetting = req.body;

    let key = Object.keys(newSetting)[0];
    let value = Object.values(newSetting)[0];
    showNotepadSettingsData[0][key] = value;

    const pathToFile = path.join(__dirname, notePadFilePath);
    const stringifiedData = JSON.stringify(showNotepadSettingsData, null, 2);
    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      if (value) {
        if (key === "showFiatNotepad") {
          return res.json("Fiat notepad set to visible");
        }
        if (key === "showCoinNotepad") {
          return res.json("Coin notepad set to visible");
        }

        if (key === "showFundingItemNotepad") {
          return res.json("Funding item notepad set to visible");
        }
      } else {
        if (key === "showFiatNotepad") {
          return res.json("Fiat notepad set to hidden");
        }
        if (key === "showCoinNotepad") {
          return res.json("Coin notepad set to hidden");
        }

        if (key === "showFundingItemNotepad") {
          return res.json("Funding item notepad set to hidden");
        }
      }
    });
  });

  server.get("/api/v1/fundingHistory", (req, res) => {
    return res.json(fundingData);
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
    const itemIndex = fundingData.findIndex((item) => item.id === id);

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
        `Funding item updated: amount = ${correctedItem.amount}, type = ${correctedItem.type}, date = ${correctedItem.date}`
      );
    });
  });

  server.delete("/api/v1/fundingHistory/:id", (req, res) => {
    const { id } = req.params;
    const itemIndex = fundingData.findIndex((item) => item.id === id);

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

  server.get("/api/v1/coins", (req, res) => {
    return res.json(coinData);
  });

  server.post("/api/v1/coins", (req, res) => {
    const coin = req.body;
    if (coinData.find((savedCoin) => savedCoin.code === coin.code)) {
      return res.json("Cannot add coin: already added");
    }
    coinData.push(coin);
    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(`${coin.amount} ${coin.name} successfully added`);
    });
  });

  server.patch("/api/v1/coins/:id", (req, res) => {
    const { id } = req.params;
    const updatedAmount = req.body[0];
    const coinIndex = coinData.findIndex((coin) => coin.code === id);

    if (coinData[coinIndex].amount === updatedAmount.amount) {
      return res.json("Cannot update coin: aleady updated");
    }
    coinData[coinIndex].amount = updatedAmount.amount;

    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `${coinData[coinIndex].name} amount updated to ${updatedAmount.amount}`
      );
    });
  });

  server.delete("/api/v1/coins/:id", (req, res) => {
    const { id } = req.params;
    const coinIndex = coinData.findIndex((coin) => coin.code === id);

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

      return res.json(`${coinName} holdings successfully deleted`);
    });
  });

  server.get("/api/v1/fiat", (req, res) => {
    return res.json(fiatData);
  });

  server.post("/api/v1/fiat", (req, res) => {
    const fiat = req.body;
    if (fiatData.find((savedFiat) => savedFiat.code === fiat.code)) {
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
    const updatedAmount = req.body[0];
    const fiatIndex = fiatData.findIndex((fiat) => fiat.code === id);

    if (fiatData[fiatIndex].amount === updatedAmount.amount) {
      return res.json("Cannot update fiat currency: already updated");
    }
    fiatData[fiatIndex].amount = updatedAmount.amount;

    const pathToFile = path.join(__dirname, fiatFilePath);
    const stringifiedData = JSON.stringify(fiatData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json(
        `${fiatData[fiatIndex].code} amount updated to ${updatedAmount.amount}`
      );
    });
  });

  server.delete("/api/v1/fiat/:id", (req, res) => {
    const { id } = req.params;
    const fiatIndex = fiatData.findIndex((fiat) => fiat.code === id);

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

      return res.json("Note has been successfully added");
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

    console.log(noteListArray);
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
