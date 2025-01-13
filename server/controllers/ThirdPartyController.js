const axios = require("axios");

class ThirdPartyController {
    static async getCurrentWeather(req, res, next) {
        try {
            let latitude = req.body.latitude;
            let longitude = req.body.longitude;
            const response = await axios({
                url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OWM_KEY}&units=metric`,
                method: "GET"
            });
            // console.log(response);
            res.status(200).json(response.data);
        } catch (err) {
            next(err);
        }
    }

    static async getWeather(req, res, next) {
        try {
            let latitude = req.body.latitude;
            let longitude = req.body.longitude;
            const response = await axios({
                url: `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.OWM_KEY}&units=metric`,
                method: "GET"
            });
            // console.log(response);
            res.status(200).json(response.data);
        } catch (err) {
            next(err);
        }
    }

    static async getQuotes(req, res, next) {
        try {
            const response = await axios({
                url: `https://quote-garden.herokuapp.com/api/v3/quotes/random`,
                method: "GET"
            });
            // console.log(response);
            res.status(200).json(response.data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ThirdPartyController;