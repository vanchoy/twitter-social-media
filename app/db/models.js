import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const postsSchema = new Schema(
  {
    title: {
      type: String
    },
    content: {
      type: String
    },
    uid: {
      type: String
    },
    favored: {
      type: []
    }
  },
  {
    timestamps: true
  }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    avatar: {
      type: String
    },
    followers: {
      type: []
    },
    following: {
      type: []
    }
  },
  {
    timestamps: true
  }
);

export const models = [
  {
    name: "Post",
    schema: postsSchema,
    collection: "posts"
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users"
  }
];
