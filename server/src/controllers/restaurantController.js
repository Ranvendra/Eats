const Restaurant = require("../models/Restaurant");

const getAllRestaurants = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const startIndex = (page - 1) * limit;
        const total = await Restaurant.countDocuments({});

        const restaurants = await Restaurant.find({}).skip(startIndex).limit(limit);

        res.status(200).json({
            data: restaurants,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching restaurants", error: err.message });
    }
};

module.exports = {
    getAllRestaurants,
};
