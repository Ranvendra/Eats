const express = require("express");
const restaurantController = require("../controllers/restaurantController");

const router = express.Router();

router.get("/", restaurantController.getAllRestaurants);
router.get("/:resId", restaurantController.getRestaurantById);
router.get("/:resId/menu", restaurantController.getRestaurantMenu);

module.exports = router;
