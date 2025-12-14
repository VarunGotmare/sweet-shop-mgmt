const sweetsService = require('../services/sweets.service');

exports.createSweet = async (req, res) => {
    try {
        const sweet = await sweetsService.createSweet(req.body);
        return res.status(201).json(sweet);
    } catch (err) {
        return res
            .status(err.statusCode || 500)
            .json({ message: err.message || 'Server error' });
    }
};

exports.getAllSweets = async (req, res) => {
    try {
        const sweets = await sweetsService.getAllSweets();
        return res.status(200).json(sweets);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Server error' });
    }
};

exports.purchaseSweet = async (req, res) => {
    try{
        const result = await sweetsService.purchaseSweet(
            req.params.id,
            req.body.quantity   
        );
        return res.status(200).json(result);
    }catch (err){
        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });      
    }
}
