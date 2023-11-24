const express = require("express");
const router = express.Router();
const premiumFeatureController = require("../controllers/premiumFeatureController");

router.get("/showLeaderBoard", premiumFeatureController.getUserLeaderBoard);

module.exports = router;
