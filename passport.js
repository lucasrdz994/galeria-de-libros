const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('./models/Usuarios');

passport.use('local-singin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      // passReqToCallback: true // nos permite pasar el req al callback, necesario para pedir mas datos al momento de registrarse
    },
    async (email, password, done) => {
      try {
        const resultado = await Usuarios.findOne({email});
        // el usuario existe, pero la contraseña no es correcta
        if (!resultado.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password incorrecto.'
          })
        }
        // si todo esta ok
        return done(null, resultado);
      } catch (error) {
        // el usuario no existe
        return done(null, false, {
          message: 'El usuario no existe.'
        })
      }
    }
  )
)

passport.serializeUser((usuario, done) => {
  done(null, usuario);
})

passport.deserializeUser((usuario, done) => {
  done(null, usuario);
})


module.exports = passport;