const router = require("express").Router();
const authentication = require("../middleware/authentication");
const todoRouters = require("./todoRouters");
const userRouters = require("./userRouters");
const thirdPartyRouters = require("./thirdPartyRouters");

router.use(userRouters);

router.use(authentication);
router.use("/todos", todoRouters);
router.use(thirdPartyRouters);

module.exports = router;