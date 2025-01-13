const route = require("express").Router();
const ThirdPartyController = require("../controllers/ThirdPartyController");

route.post("/current-weather", ThirdPartyController.getCurrentWeather);
route.post("/weather", ThirdPartyController.getWeather);
route.get("/quotes", ThirdPartyController.getQuotes);

module.exports = route;