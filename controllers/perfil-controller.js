const Perfil = require('../models/perfil');
const config = require('../config');

module.exports = {
    lista: async (req, res) => {
       try {
           let perfis = await Perfil.find();
           res.json(perfis);
       } catch (error) {
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'})
       }
    },
    insert: async (req, res) => {
       try {
           let body = req.body || {};
           if(body._id){
               let _perfil = await Perfil.findById(body._id);
               if(_perfil.nome == config.perfil_master)
                return res.json(body);
               let perfil = await Perfil.findByIdAndUpdate(body._id, body);
               console.log(perfil);
               return res.json(perfil);
           }
           delete body._id;
           let perfil = new Perfil(body);
           await perfil.save();
           res.json(perfil);
       } catch (error) {
           console.log(error);
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'});
       }
    },
}