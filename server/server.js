"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

const PORT = 3000;
const ENV = process.env.ENV;

const app = express();

const publicDirs = ['dist', 'src', 'public', 'node_modules'];
publicDirs.forEach((dir) => {
  app.use(express.static(path.join(__dirname, "..", dir)));
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

if (ENV === "prod") {
  const sslOptions = {
    key: fs.readFileSync(`${process.env.SSL_PATH}/${process.env.PRIVATE_KEY}`),
    cert: fs.readFileSync(`${process.env.SSL_PATH}/${process.env.PUBLIC_KEY}`),
  };

  https
    .createServer(sslOptions, app)
    .listen(PORT, () => {
      console.log(`https server is running in production mode and listening on port ${PORT}`);
    })
    .on("error", (err) => {
      console.error(`failed to start https server: ${err.message}`);
    });
} else {
  http
    .createServer(app)
    .listen(PORT, () => {
      console.log(`http server is running in development mode and listening on port ${PORT}`);
    })
    .on("error", (err) => {
      console.error(`failed to start http server: ${err.message}`);
    });
}
