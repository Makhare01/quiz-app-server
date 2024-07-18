import { Schema, model } from "mongoose";

const DropdownAnswersOptionSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const DropdownAnswersSchema = new Schema({
  answer: {
    type: String,
    required: [true, "Dropdown answer field is required"],
  },
  options: [DropdownAnswersOptionSchema],
});

const AnswersSchema = new Schema({
  answer: String,
  isCorrect: Boolean,
});

export const QuestionSchema = new Schema({
  question: {
    type: String,
    required: [true, "Question title is required"],
  },
  type: {
    type: String,
    required: [true, "Question type is required"],
  },
  isRequired: Boolean,
  order: {
    type: Number,
    required: [true, "Order number is required"],
  },
  answers: [AnswersSchema],
  dropdownAnswers: DropdownAnswersSchema,
});

const QuestionsSchema = new Schema(
  {
    quizName: String,
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  }
);

export const Question = model("question", QuestionsSchema);
