const next = require("next");
const express = require("express")
const bodyParser = require("body-parser")

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const filePath = "./settingsData.json";
fs = require("fs");
path = require("path");
const settingsData = require(filePath);

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

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