import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  sessionId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new Schema<IConversation>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);