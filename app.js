var createError = require("http-errors");
var express = require("express");
var https = require("https");
var http = require("http");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var compression = require("compression");
var nocache = require("nocache");
var bodyParser = require("body-parser");
const schedule = require("node-schedule");
require("dotenv").config();

// File System
var fs = require("fs");

// Initialize SSL Certificates
// var https_options = {
//   key: fs.readFileSync("./certificate/private.key"),
//   cert: fs.readFileSync("./certificate/certificate.crt"),
//   ca: fs.readFileSync("./certificate/ca_bundle.crt"),
// };

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(logger("combined", { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(nocache());

// Initialize CORS
corsOptions = {
  origin: ["https://hrms.mscorpres.online", "https://login.mscorpres.online", "https://essp.mscorpres.online"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
};
app.use(cors(corsOptions));

require("./routes/router")(app);

app.get("/", function (req, res) {
  return res.send("<h3>Socket Server is Live 2</h3>");
});

// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
  return res
    .status(404)
    .send(require("./helper/backendProcess/error_404").error_404());
});
*/
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT;

//with http://
const node_server = http
  .createServer(app, () => {
    timeout = 6000000; // Miliseconds
  })
  .listen(port);
console.log(`server started at port ${port}`);

//sendAdminMail()

var io = require("socket.io")(node_server, {
  pingTimeout: 6000000,
  pingInterval: 6000000,
  transports: ["websocket", "polling"],
  upgrade: false,
  cors: {
    origin: "*",
    // origin: ["https://hrms.mscorpres.online", "https://login.mscorpres.online", "https://essp.mscorpres.online"],
    allowedHeaders: ["token", "Content-Type", "page_id", "type"],
  },
});

// app.set("socketio", io);
require("./helper/sockets_fun").myFunction(io);
