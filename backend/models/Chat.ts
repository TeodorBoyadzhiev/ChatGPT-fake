import mongoose, { Document, Model, Schema } from "mongoose";

// 1. TypeScript интерфейси за структурата на документа
interface ChatPart {
  text: string;
}

interface ChatHistoryEntry {
  role: "user" | "model";
  parts: ChatPart[];
  img?: string;
}

export interface IChat extends Document {
  userId: string;
  history: ChatHistoryEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Mongoose Schema
const chatSchema: Schema<IChat> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "model"],
          required: true,
        },
        parts: [
          {
            text: {
              type: String,
              required: true,
            },
          },
        ],
        img: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);
export default Chat;