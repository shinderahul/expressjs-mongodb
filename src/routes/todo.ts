import express from "express";
import {
  createTodo,
  deleteTodo,
  retrieveAllTodos,
  updateTodo,
} from "../controller/todo";

const router = express.Router();

router.post("/todos", createTodo);
router.get("/todos", retrieveAllTodos);
router.put("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

export default router;
