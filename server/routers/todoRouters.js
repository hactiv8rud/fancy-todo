const router = require("express").Router();
const authorization = require("../middleware/authorization");
const TodoController = require("../controllers/TodoController");

router.post("/", TodoController.read);
router.post("/add", TodoController.add); 

router.post("/:id", authorization, TodoController.findByPk);
router.put("/:id", authorization, TodoController.put);
router.patch("/:id", authorization, TodoController.patch);
router.delete("/:id", authorization, TodoController.delete);

module.exports = router;