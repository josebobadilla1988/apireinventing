const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const log = require("./utils/logger");
const app = express();
const cors = require("cors");
var session = require('express-session');
// const apm = require('elastic-apm-node').start({
//   serverUrl: 'http://192.168.4.105:8200'
// });

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  // store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: 600000
  }
}));

//ENV PRODUCCION
const isProd = process.env.NODE_ENV === "production";

// Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({ path: `.env.${process.env.NODE_ENV}` });

// Usamos body-parse para revisar el body cuando los request son post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(cors());

// Archivos de rutas
const userRoute = require("./api/routes/users")

// Rutas
app.use("/api/v1.0/usuerio", userRoute)

require('./api/routes/auth')(app)




// ENDPOINT GET PRUEBA
app.get(
  "/",
  (rootHandler = (req, res) => {
    res.json("MicroServicio de Evaluacion");
  })
);


// Registro de puerto y servidor.
app.disable("x-powered-by");
app.set("port", process.env.PORT);
app.set("host", process.env.NODEJS_IP);

// Iniciando Servidor.
app.listen(app.get("port"), app.get("host"), () => {
  log.info(`MS on http://${app.get("host")}:${app.get("port")}`);
});
