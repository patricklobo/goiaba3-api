const Empresa = require('../models/empresa');
const config = require('../config');

module.exports = {
    lista: async (req, res) => {
       try {
           let empresas = await Empresa.find();
           res.json(empresas);
       } catch (error) {
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'})
       }
    },
    insert: async (req, res) => {
       try {
        let body = req.body || {};
        if(body._id){
            await Empresa.findByIdAndUpdate(body._id, body);
            return res.json(body);
        }
        delete body._id;
        let empresa = new Empresa(body);
        await empresa.save();
        res.json(empresa);
       } catch (error) {
           console.log(error);
           res.status(405);
           res.json({msg: 'Ocorreu um erro.'});
       }
    },
}