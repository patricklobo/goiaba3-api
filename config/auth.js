const config = require('./index');
const permissoes = require('./permissoes');
const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');
const Perfil = require('../models/perfil');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

let decode = async (token) => {
        try {
            var decoded = jwt.verify(token, config.secret);
            let user = await Usuario.findById(decoded.admin);
            return user;
        } catch (err) {
            throw ('Token invalido.');
        }
}

module.exports = {
    autoriza: (rota) => {
        return async (req, res, next) => {
            try {
                let token = req.headers['token'];
                let idempresa = req.headers['empresa'];
                let user = await decode(token);
                let usuario = await Usuario.findOne({_id: user._id, 'empresas._id': idempresa});
                if(!usuario) throw ('Usuário não encontrado');
                req.usuario = usuario;
                let empresa = usuario.empresas.filter(v => v._id == idempresa)[0];
                req.usuario.empresa = empresa;
                if(empresa.perfil.nome == config.perfil_master)
                {
                    next();
                    return 1;
                }
                let perfil = await Perfil.findById(empresa.perfil._id);
                if(Array.isArray(rota)){
                    for(let i of perfil.permissoes){
                        for(let _rota of rota){
                            if(_rota == i){
                                next();
                                return 1;
                            }
                        }
                    }
                } else {
                    for(let i of perfil.permissoes){
                        if(rota == i){
                            next();
                            return 1;
                        }
                    }
                }
                throw ('Permissão não encontrada');
            } catch (error) {
                console.log(error);
                res.status(403);
                res.json({msg: 'Não autorizado'});
                return 0;
            }
        }
    },
    autentica: async (req, res) => {
        let msg = "Falha ao autenticar.";
        try {
            let {username, senha } = req.body;
            let user = await Usuario.findOne({ username, status: 1 }).select("usuario username empresas empresa senha status");
            if (!user) throw ("Usuario não encontrado");
            if (!bcrypt.compareSync(senha, user.senha)) {
                
                throw ("Senha errada");
            }
            const payload = {
                admin: user._id
            };
            
            var token = jwt.sign(payload, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            let perm = {};
            if(user.empresa.perfil.nome == config.perfil_master){
                perm = permissoes;
            } else {
                let perfil = await Perfil.findById(user.empresa.perfil._id);
                perfil.permissoes.map(v => {perm[v] = permissoes[v]});
            }
            console.log(perm);
            res.json({
                success: true,
                usuario: {
                    _id: user._id,
                    nome: user.nome,
                    email: user.email,
                    empresa: {
                        ...user.empresa, 
                        permissoes: perm
                    },
                    empresas: user.empresas,
                },
                token: token
            })
        } catch (error) {
                console.log(error);
                res.status(403);
                res.json({msg});
                return true;
        }
        
    }
}