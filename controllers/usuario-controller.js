const Usuario = require('../models/usuario');
const config = require('../config');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
    validaUsername: async (req, res) => {
       try {
           let body = req.body || {};
           let usuarios = await Usuario.find(body).count();
           res.json({usuarios});
       } catch (error) {
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'})
       }
    },
    lista: async (req, res) => {
       try {
           let usuarios = await Usuario.find();
           res.json(usuarios);
       } catch (error) {
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'})
       }
    },
    insert: async (req, res) => {
       try {
           let body = req.body || {};
           if(body._id){
               if(body.senha) body.senha = bcrypt.hashSync(body.senha);
               console.log(body);
               await Usuario.findByIdAndUpdate(body._id, body);
               delete body.senha;
               delete body.senha2;
               return res.json(body);
           }
           delete body._id;
           body.senha = bcrypt.hashSync(body.senha);
           let usuario = new Usuario(body);
           await usuario.save();
           res.json(usuario);
       } catch (error) {
           console.log(error);
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'});
       }
    },
}