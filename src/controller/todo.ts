import { Request, Response } from "express";
import Todo from "../models/Todo";

// Create a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ error: errMsg });
  }
};

// Retrieve all todos
export const retrieveAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "An error occurred";
    res.status(400).json({ error: errMsg });
  }
};

// Update a todo
export const updateTodo = async (req: any, res: any) => {
  try {
    const { title, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Todo not found";
    res.status(404).json({ error: errMsg });
  }
};

// Delete a todo
export const deleteTodo = async (req: any, res: any) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Todo not found";
    res.status(404).json({ error: errMsg });
  }
};
