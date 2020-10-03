const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const log = require("./utils/logger");
const app = express();
const cors = require("cors");
// const apm = require('elastic-apm-node').start({
//   serverUrl: 'http://192.168.4.105:8200'
// });

//ENV PRODUCCION
const isProd = process.env.NODE_ENV === "production";

// Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({ path: `.env.${process.env.NODE_ENV}` });

// Usamos body-parse para revisar el body cuando los request son post
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Cros */
if (!isProd) {
  app.use(cors());

  var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "example.com");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  };
}


// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// Middlewa que verifica si el usuario es un administrador.
// function isAdmin(req, res, next) {
//   req.requestTime = Date.now();
//   console.log('Request URL:', req.originalUrl);
//   console.log('Request Type:', req.method);
//   const Iframe = JSON.stringify(req.url)
//   console.log(`${Iframe}`);
//   next()
//   // if (req.body.isAdmin) {
//   //   next();
//   // } else {
//   //   res.status(403).send(`Sorry but you are not an admin and you do not have access to route ${req.url}`);
//   // }
// }



const userRoute = require("./api/routes/users")

// Rutas
app.use("/api/v1.0/usuerio", userRoute)



// Se agrega el middleware en la aplicación.
// app.use(isAdmin);

// Registro de puerto y servidor.
app.disable("x-powered-by");
app.set("port", process.env.PORT);
app.set("host", process.env.NODEJS_IP);

// ENDPOINT GET PRUEBA
// app.get(
//   "/",
//   (rootHandler = (req, res) => {
//     res.json("MicroServicio de Evaluacion");
//   })
// );


// ENDPOINTS POST
// app.post("/ms/template", templateController.template);





// Iniciando Servidor.
app.listen(app.get("port"), app.get("host"), () => {
  log.info(`MS on http://${app.get("host")}:${app.get("port")}`);
});
