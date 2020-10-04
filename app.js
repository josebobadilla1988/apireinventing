const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const log = require("./utils/logger");
const app = express();
const cors = require("cors");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var User = require('./models/user');
var bcrypt = require('bcrypt');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();
// const apm = require('elastic-apm-node').start({
//   serverUrl: 'http://192.168.4.105:8200'
// });

app.use(morgan('dev'));

// app.use((req, res, next) => {

//   // Dominio que tengan acceso (ej. 'http://example.com')
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   // Metodos de solicitud que deseas permitir
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

//   // Encabecedados que permites (ej. 'X-Requested-With,content-type')
//   res.setHeader('Access-Control-Allow-Headers', '*');

//   next();
// })

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

app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});



// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  console.log("req.session.user", req.session.user);
  console.log("req.session.user_sid", req.cookies.user_sid);
  if (req.session.user && req.cookies.user_sid) {
    console.log("estas login");
    res.send("estas login")
    // res.redirect('/dashboard');
  }
  next();
};

app.use(sessionChecker);

// route for Home-Page
// app.get('/', sessionChecker, (req, res) => {
//   console.log("/login");
//   res.send("/login")
// res.redirect('/login');
// });

function validPassword(password, passwordGet) {
  return bcrypt.compareSync(password, passwordGet);
}

// route for user signup
app.route('/signup')
  .post((req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(user => {
        req.session.user = user.dataValues;
        // res.redirect('/dashboard');
        res.send('/dashboard');
      })
      .catch(error => {
        // res.redirect('/signup');
        res.send('/signup');
      });
  });


// route for user Login
app.route('/login')
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
      if (!user) {
        // res.redirect('/login');
        console.log("/login");
        res.send('/login')
      } else if (!validPassword(password, user.dataValues.password)) {
        // res.redirect('/login');
        console.log("/login");
        res.send('/login')
      } else {
        req.session.user = user.dataValues;
        // res.redirect('/dashboard');
        console.log("/dashboard");
        res.send('/dashboard')
      }
    });
  });


// route for user's dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/login');
  }
});


// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.send("Deslogueo Correcto")
    // res.redirect('/');
  } else {
    // res.redirect('/login');
    res.send("No estas liogue")
  }
});



// Archivos de rutas
const userRoute = require("./api/routes/users");
const { middleware } = require("elastic-apm-node");


// Rutas
app.use("/api/v1.0/usuerio", userRoute)





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
