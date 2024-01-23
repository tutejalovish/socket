const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { hrmsDB } = require("./../config/pgdatabase");

exports.myFunction = function (io) {
  io.on("connection", (socket) => {
    require("./SOCKETS/requestReceiver").request(io, socket);
  });

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
};
