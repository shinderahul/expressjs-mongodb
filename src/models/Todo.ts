import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
}

const todoSchema = new Schema<ITodo>({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo: Model<ITodo> = mongoose.model<ITodo>("Todo", todoSchema);
export default Todo;
