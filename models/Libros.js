const mongoose = require('mongoose');

const librosSchema = new mongoose.Schema({
  titulo: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  edicion: {
    type: Number
  },
  precio: {
    type: Number
  },
  leido: {
    type: Boolean,
    default: false
  },
  imagen: String,
  public_id: String
}, { collection: 'libros' });

module.exports = mongoose.model('Libro', librosSchema);