const { User } = require("../models");
const { verifyToken } = require("../helper/jwt");

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.headers.access_token;
        const refreshToken = req.cookies['refreshToken'];
        const csrfToken = req.body.csrfToken;
        if (!accessToken || !refreshToken || !csrfToken) {
            throw {
                status: 401,
                message: "Unauthorised Access!"
            }
        } else {
            const decoded = verifyToken(accessToken);
            req.loggedInUser = decoded;
            const data = await Token.findOne({
                where: {
                    [Op.and]: [{ accessToken }, { refreshToken }, { csrfToken }]
                }
            });

            if (!data) {
                throw {
                    status: 401,
                    message: "Unauthorised Access!"
                }
            }

            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            })
            
            if (user) {
                next();
            } else {
                throw {
                    status: 401,
                    message: "Unauthorised Access!"
                }
            }
        }
    } catch (err) {
        next(err);
    }
}