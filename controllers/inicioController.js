// modelos
const Usuarios = require('../models/Usuarios');

const getInicio = async (req, res) => {
  const resultado = await Usuarios.findById(res.locals.usuarioConectado._id).populate('libros');
  res.render('inicio', {
    pagina: 'Galería de libros',
    libros: resultado.libros
  })
}

module.exports = {
  getInicio
}