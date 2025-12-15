const logsService = require('../services/logs.service');

exports.getLogs = async (req, res) => {
    try {
        const result = await logsService.getLogs({
            query: req.query,
            user: req.user,
        });

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res
            .status(err.statusCode || 500)
            .json({ message: err.message || 'Server error' });
    }
};
