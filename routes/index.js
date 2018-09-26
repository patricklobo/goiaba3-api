const errors = require('restify-errors');
const UsuarioController = require('../controllers/usuario-controller');
const PerfilController = require('../controllers/perfil-controller');
const EmpresaController = require('../controllers/empresa-controller');
const Auth = require('../config/auth');

module.exports = function(server) {
    server.post('/login', Auth.autentica);
    server.get('/perfis', Auth.autoriza([7, 14]), PerfilController.lista);
    server.post('/perfis/novo', Auth.autoriza(8), PerfilController.insert);
    server.get('/empresa', Auth.autoriza([10, 14]), EmpresaController.lista);
    server.post('/empresa/nova', Auth.autoriza(11), EmpresaController.insert);
    server.get('/usuario', Auth.autoriza(13), UsuarioController.lista);
    server.post('/usuario/validausername', Auth.autoriza(14), UsuarioController.validaUsername);
    server.post('/usuario/novo', Auth.autoriza(14), UsuarioController.insert);
};