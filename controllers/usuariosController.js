// modelos
const Usuarios = require('../models/Usuarios');

const getCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    pagina: 'Crear cuenta'
  })
}

const postCrearCuenta = async (req, res) => {
  const { email, password } = req.body;
  try {
    await Usuarios.create({
      email, password
    })
    res.redirect('/iniciarSesion');
  } catch (error) {
    res.render('crearCuenta', {
      pagina: 'Crear cuenta',
      errores: error.errors,
      email,
      password
    })
  }
}

const getInciarSesion = async (req, res) => {
  const { error, correcto } = req.flash();
  res.render('iniciarSesion', {
    pagina: 'Iniciar sesión',
    error,
    correcto
  })
}

const getReestablecer = (req, res) => {
  const { error } = req.flash();
  res.render('reestablecer', {
    pagina: 'Reestablecer contraseña',
    error
  })
}

module.exports = {
  getCrearCuenta,
  postCrearCuenta,
  getInciarSesion,
  getReestablecer
}