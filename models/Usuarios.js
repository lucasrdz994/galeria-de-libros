const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator');

const usuariosSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Escribe un email para tu cuenta',
    index: true,
    uniqueCaseInsensitive: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Escribe un email correcto']
  },
  password: {
    type: String,
    required: 'Escribe una constraseña para tu cuenta.',
    trim: true
  },
  token: String,
  expiracion: Date,
  libros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro'
  }]
});

usuariosSchema.plugin(uniqueValidator, {message: 'El {PATH} no esta disponible.'})

usuariosSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(5));
  next();
})

usuariosSchema.methods.verificarPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Usuario', usuariosSchema);