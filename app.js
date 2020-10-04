const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const log = require("./utils/logger");
const app = express();
const cors = require("cors");

// Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({ path: `.env.${process.env.NODE_ENV}` });

// Usamos body-parse para revisar el body cuando los request son post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MIDDLEWARE
app.use(cors());


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Webservices Reinventing." });
});


// Rutas
require('./api/routes/auth')(app)
require('./api/routes/users')(app)


// Registro de puerto y servidor.
app.disable("x-powered-by");
app.set("port", process.env.PORT);
app.set("host", process.env.NODEJS_IP);

// Iniciando Servidor.
app.listen(app.get("port"), app.get("host"), () => {
  log.info(`MS on http://${app.get("host")}:${app.get("port")}`);
});
