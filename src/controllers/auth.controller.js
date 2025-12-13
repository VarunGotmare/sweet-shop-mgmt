const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try{
        const user = await authService.register(req.body);
        return res.status(201).json(user);
    }catch(error){
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};
