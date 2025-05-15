import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Интерфейс за всеки чат в масива
interface IUserChatItem {
  _id: string;
  title: string;
  createdAt?: Date;
}

// 2. Основен интерфейс за документа
export interface IUserChats extends Document {
  userId: string;
  chats: IUserChatItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. Mongoose schema
const userChatsSchema: Schema<IUserChats> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chats: [
      {
        _id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// 4. Експорт на типизирания модел
const UserChats: Model<IUserChats> = mongoose.models.UserChats || mongoose.model<IUserChats>("UserChats", userChatsSchema);
export default UserChats;