const express = require('express');
const path = require('path');
const router = require('./router');
const database = require('./database');
const flash = require('connect-flash');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const passport = require('./passport');

// const db = database.connection;
// db.on('error', console.error.bind(console, 'conecction error'));
// db.once('open', () => {
//   console.log('Conectado a mongoDB');
// })


const app = express();

// Configuraciones
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.usuarioConectado = {...req.user} || null;
  // {...req.user} crea una copia exacta, si no, poneme un null
  // req.user almacena los datos del usuario logueado
  // console.log(res.locals.usuarioConectado);
  next();
})

// Rutas
app.use(router);

// Arrancar el server
app.listen(app.get('port'), _ => {
  console.log('Servidor conectado en el puerto ' + app.get('port'));
})