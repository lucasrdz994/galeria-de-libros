const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const mailer = require('../mailer');

const autenticarUsuario = passport.authenticate('local-singin', {
  successRedirect: '/',
  failureRedirect: '/iniciarSesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios.'
})

// verifica si el usuario esta autenticado
const usuarioAutenticado = (req, res, next) => {
  // si esta autenticado
  if (req.isAuthenticated()) {
    return next();
  }
  // si no esta autenticado
  return res.redirect('/iniciarSesion');
}

const getCerrarSesion = (req, res) => {
  // req.session.destroy( _ => {
  //   res.redirect('/iniciarSesion');
  // })
  req.logout();
  res.redirect('/iniciarSesion');
}

const solicitarToken = async (req, res) => {
  // verificar que el usuario exista
  const { email } = req.body;
  const resultado = await Usuarios.findOne({email});

  // Si el usuario no existe
  if (!resultado) {
    req.flash('error', 'No existe esta cuenta.');
    res.redirect('/reestablecer');
  }

  // Si el usuario existe
  // genero un token
  const token = crypto.randomBytes(20).toString('hex');
  // Genero expiracion por una hora
  const expiracion = Date.now() + 3600000;

  // console.log(expiracion)

  // modifico el usuario con el token

  resultado.token = token;
  resultado.expiracion = expiracion;

  await resultado.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${resultado.token}`;

  // res.redirect(resetUrl);

  await mailer({
    pagina: 'reestablecer',
    destinatario: resultado.email,
    asunto: 'Reestablece la contraseña de tu cuenta',
    resetUrl
  })

  req.flash('correcto', 'Se envio un mail para reestablecer la contraseña.');
  res.redirect('/iniciarSesion');

}

const resetearPassword = async (req, res) => {
  // Verifico el token
  const { token } = req.params;
  const usuario = await Usuarios.findOne({token})

  // Si no encuentra el usuario, nos aseguramos de que no quieran reestablecer una constraseña de un link no válido
  if (!usuario) {
    req.flash('error', 'Token no válido.');
    res.redirect('/reestablecer');
  }

  // reestablecer contraseña
  res.render('resetearPassword', {
    pagina: 'Resetear password'
  })
}

const cambiarPassword = async (req, res) => {
  // Busco el usuario y checkeo que no haya vencido el token
  const { token } = req.params;
  const usuario = await Usuarios.findOne(
    {
      token,
      expiracion: { $gte: Date.now() }
    }
  )
  // la expiracion tiene que ser mayor o igual al momento actual

  if (!usuario) {
    req.flash('error', 'Token no válido o expirado');
    res.redirect('/reestablecer');
  }

  // Si todo esta ok, guardo la nueva contraseña y borro el token
  const { password } = req.body;
  usuario.password = password;
  usuario.expiracion = null;
  usuario.token = null;
  const resultado = await usuario.save();

  req.flash('correcto', 'Tu password se modifico correctamente.');
  res.redirect('/iniciarSesion');
}

module.exports = {
  autenticarUsuario,
  usuarioAutenticado,
  getCerrarSesion,
  solicitarToken,
  resetearPassword,
  cambiarPassword
}