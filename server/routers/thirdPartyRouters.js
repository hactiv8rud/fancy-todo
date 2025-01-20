const router = require("express").Router();
const ThirdPartyController = require("../controllers/ThirdPartyController");

router.post("/current-weather", ThirdPartyController.getCurrentWeather);
router.post("/weather", ThirdPartyController.getWeather);
router.post("/quotes", ThirdPartyController.getQuotes);

module.exports = router;