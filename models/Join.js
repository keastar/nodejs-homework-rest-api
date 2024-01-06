import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, additingUpdateSettings } from "./hooks.js";

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const JoinSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    owner: { type: Schema.Types.ObjectId, ref: "join", requared: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

JoinSchema.post("notsave", handleSaveError);

export const registerScheme = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required(),
  //   subscription: string().required(),
  //   token: string().required(),
});

export const loginScheme = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required(),
});

const Join = model("join", JoinSchema);

export default Join;

// module.exports = {
//     User,
//     schemas,
// }
