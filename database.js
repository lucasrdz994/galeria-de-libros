if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(db => console.log('Base de datos conectada'))
.catch (error => console.error(error));

module.exports = mongoose;