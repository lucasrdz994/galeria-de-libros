const cloudinary = require('cloudinary').v2;

// modelos
const Libros = require('../models/Libros');
const Usuarios = require('../models/Usuarios');

const fs = require('fs');

const getFormNuevoLibro = (req, res) => {
  res.render('nuevoLibro', {
    pagina: 'Agregar un nuevo libro'
  })
}

const getFormEditarLibro = async (req, res) => {
  const { id } = req.params;
  const libro = await Libros.findById(id);
  res.render('nuevoLibro', {
    pagina: 'Editar libro',
    libro
  })
}

const postNuevoLibro = async (req, res) => {
  // console.log(req.file);
  const { url, public_id } = req.file;
  const { titulo, edicion, precio, descripcion } = req.body;
  const libro = new Libros({
    titulo,
    edicion,
    precio,
    descripcion,
    imagen: url,
    public_id
  });
  try {
    const resultado = await libro.save();
    await Usuarios.findByIdAndUpdate(res.locals.usuarioConectado._id, {
      $push: {
        libros: resultado
      }
    })
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}

const editarLibro = async (req, res, next) => {
  const { titulo, edicion, precio, descripcion } = req.body;
  const { id } = req.params;
  const resultado = await Libros.findByIdAndUpdate(id, {
    $set: {
      titulo, edicion, precio, descripcion
      // imagen: req.file.filename
    }
  })
  if (!resultado) return next();

  res.status(200).redirect('/');
}

const deleteLibro = async (req, res, next) => {
  const { id } = req.params;
  try {
    const resultado = await Libros.findByIdAndDelete(id);
  
    // Elimino del sistema
    // fs.unlinkSync(`./public/dist/uploads/${resultado.imagen}`, err => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
  
    // Si no hay resultado, hubo un error, vuelve al inicio
    if (!resultado) return res.redirect('/');
  
    // elimino de cloudinary
    await cloudinary.uploader.destroy(resultado.public_id);
  
    // elimino el libro del usuario
    await Usuarios.findByIdAndUpdate(res.locals.usuarioConectado._id, {
      $pull: {
        libros: resultado.id
      }
    })
  
    res.status(200).send('Libro eliminado correctamente!');
  } catch (error) {
    console.log(error);
  }
}

const patchLibro = async (req, res, next) => {
  const { id } = req.params;

  const estadoActual = await Libros.findById(id, 'leido');

  if (!estadoActual) return next();

  const estado = !estadoActual.leido;

  await Libros.findByIdAndUpdate(id, {
    $set: {
      leido: estado
    }
  })

  res.status(200).send(estado);

}

module.exports = {
  getFormNuevoLibro,
  postNuevoLibro,
  deleteLibro,
  patchLibro,
  getFormEditarLibro,
  editarLibro
}