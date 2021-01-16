const router = require('express').Router();

const upload = require('../multer');

// Controladores
const { getInicio } = require('../controllers/inicioController');
const { 
  getFormNuevoLibro,
  postNuevoLibro,
  deleteLibro,
  patchLibro,
  getFormEditarLibro,
  editarLibro
} = require('../controllers/librosController');

const {
  getCrearCuenta,
  postCrearCuenta,
  getInciarSesion,
  getReestablecer
} = require('../controllers/usuariosController');

const {
  autenticarUsuario,
  usuarioAutenticado,
  getCerrarSesion,
  solicitarToken,
  resetearPassword,
  cambiarPassword
} = require('../controllers/authController');

// Checkea la autenticacion de todas las rutas que este abajo de este middleware.
/* router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/iniciarSesion');
}) */

router.get('/', usuarioAutenticado, getInicio);

router.get('/nuevoLibro', usuarioAutenticado, getFormNuevoLibro);
router.get('/editarLibro/:id', usuarioAutenticado, getFormEditarLibro);

router.post('/libro', usuarioAutenticado, upload.single('imagen'), postNuevoLibro);
router.post('/libro/:id', usuarioAutenticado, editarLibro);

router.delete('/libro/:id', usuarioAutenticado, deleteLibro);

router.patch('/libro/:id', usuarioAutenticado, patchLibro);

// login y crear cuenta
router.get('/crearCuenta', getCrearCuenta);
router.post('/crearCuenta', postCrearCuenta);
router.get('/iniciarSesion', getInciarSesion);
router.post('/iniciarSesion', autenticarUsuario);
router.get('/cerrarSesion', getCerrarSesion);

// Restablecer
router.get('/reestablecer', getReestablecer);
router.post('/reestablecer', solicitarToken);

router.get('/reestablecer/:token', resetearPassword);
router.post('/reestablecer/:token', cambiarPassword);

module.exports = router;