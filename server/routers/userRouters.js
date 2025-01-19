const router = require("express").Router();
const UserController = require("../controllers/UserController");
const authentication = require("../middleware/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/googleLogin", UserController.googleLogin);
router.post("/reauth", UserController.refreshToken);

router.use(authentication);
router.post("/logout", UserController.logout);
router.post ("/logout-all", UserController.logoutAll);

module.exports = router;