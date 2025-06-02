const express = require("express");
const router = express.Router();

const {
  createTodo,
  retrieveAllTodos,
  updateTodo,
  deleteTodo,
} = require("../controller/todoController");

router.post("/todos", createTodo);
router.get("/todos", retrieveAllTodos);
router.put("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

module.exports = router;
