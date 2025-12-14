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
        const sweets = await sweetsService.getAllSweets(req.query);
        return res.status(200).json(sweets);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Server error' });
    }
};

exports.purchaseSweet = async (req, res) => {
    try {
        const result = await sweetsService.purchaseSweet(
            req.params.id,
            req.body.quantity,
            req.user.id
        );
        return res.status(200).json(result);
    } catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
    }
}

exports.restockSweet = async (req, res) => {
    try {
        const result = await sweetsService.restockSweet(
            req.params.id,
            req.body.quantity,
            req.user.id
        );
        return res.status(200).json(result);
    } catch (err) {
        return res
            .status(err.statusCode || 500)
            .json({ message: err.message || 'Server error' });
    }
}

exports.searchSweets = async (req, res) => {
    try {
        const sweets = await sweetsService.searchSweets(req.query);
        return res.status(200).json(sweets);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Server error' });
    }
}

exports.updateSweet = async (req, res) => {
    try {
        const updated = await sweetsService.updateSweet(
            req.params.id,
            req.body
        );

        return res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        return res
            .status(err.statusCode || 500)
            .json({ message: err.message || 'Server error' });
    }
};

exports.deleteSweet = async (req, res) => {
    try {
        await sweetsService.deleteSweet(req.params.id);
        return res.status(200).json({
            message: 'Sweet deleted successfully',
        });
    } catch (err) {
        console.error(err);
        return res
            .status(err.statusCode || 500)
            .json({ message: err.message || 'Server error' });
    }
};

