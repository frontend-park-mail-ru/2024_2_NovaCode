"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const PORT = process.env.PORT || 443;

const sslOptions = {
  key: fs.readFileSync("/etc/ssl/nova-music.ru/privkey.pem"),
  cert: fs.readFileSync("/etc/ssl/nova-music.ru/fullchain.pem"),
};

console.log(sslOptions);

const app = express();

const publicDirs = ['dist', 'src', 'public', 'node_modules'];
publicDirs.forEach((dir) => {
  app.use(express.static(path.join(__dirname, "..", dir)));
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

https
  .createServer(sslOptions, app)
  .listen(PORT, () => {
    console.log(`https server is running and listening on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error(`failed to start server: ${err.message}`);
  });
