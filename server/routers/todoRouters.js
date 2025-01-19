const router = require("express").Router();
const authorization = require("../middleware/authorization");
const TodoController = require("../controllers/TodoController");

router.post("/", TodoController.add);
router.get("/", TodoController.read);

router.use(authorization);
router.get("/:id", TodoController.findByPk);
router.put("/:id", TodoController.put);
router.patch("/:id", TodoController.patch);
router.delete("/:id", TodoController.delete);

module.exports = router;