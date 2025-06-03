const Todo = require("../models/Todo");

const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get /todos - Retrieve all todos
const retrieveAllTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

// Put /todos/:id - Update a todo
const updateTodo = async (req, res) => {
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
    res.status(4040).json({ error: error.message });
  }
};

// Delete /todos/:id - Delete a todo
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createTodo,
  retrieveAllTodos,
  updateTodo,
  deleteTodo,
};
