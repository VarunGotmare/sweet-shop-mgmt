const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try{
        const user = await authService.register(req.body);
        return res.status(201).json(user);
    }catch(error){
        return res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try{
        const user = await authService.login(req.body);
        return res.status(200).json(user);
    }catch(err){
        return res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
    }
};