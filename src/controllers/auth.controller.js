const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
};
