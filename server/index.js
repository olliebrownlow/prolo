const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const currencyFilePath = "./currencySettingsData.json";
const themeFilePath = "./themeSettingsData.json";
const coinFilePath = "./coinData.json";
const fiatFilePath = "./fiatData.json";
fs = require("fs");
path = require("path");
const currencySettingsData = require(currencyFilePath);
const themeSettingsData = require(themeFilePath);
const coinData = require(coinFilePath);
const fiatData = require(fiatFilePath);

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.get("/api/v1/currencySettings", (req, res) => {
    return res.json(currencySettingsData);
  });

  server.get("/api/v1/themeSettings", (req, res) => {
    return res.json(themeSettingsData);
  });

  server.get("/api/v1/coins", (req, res) => {
    return res.json(coinData);
  });

  server.get("/api/v1/coins/:id", (req, res) => {
    const { id } = req.params;
    const coin = coinData.find((coin) => coin.code === id);
    return res.json(coin);
  });

  server.delete("/api/v1/coins/:id", (req, res) => {
    const { id } = req.params;
    const coinIndex = coinData.findIndex((coin) => coin.code === id);

    if (coinIndex < 0) {
      return res.json("Coin already deleted :)");
    }

    coinData.splice(coinIndex, 1);

    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Coin has been successfully deleted :)");
    });
  });

  server.post("/api/v1/coins", (req, res) => {
    const coin = req.body;
    coinData.push(coin);
    const pathToFile = path.join(__dirname, coinFilePath);
    const stringifiedData = JSON.stringify(coinData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Coin has been successfully added :)");
    });
  });

  server.get("/api/v1/fiat", (req, res) => {
    return res.json(fiatData);
  });

  server.post("/api/v1/fiat", (req, res) => {
    const fiat = req.body;
    fiatData.push(fiat);
    const pathToFile = path.join(__dirname, fiatFilePath);
    const stringifiedData = JSON.stringify(fiatData, null, 2);

    fs.writeFile(pathToFile, stringifiedData, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.json("Fiat has been successfully added :)");
    });
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

      return res.json("Currency has been successfully updated :)");
    });
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

      return res.json("Theme has been successfully updated :)");
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
