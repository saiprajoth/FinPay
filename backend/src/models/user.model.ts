import mongoose, { Schema, Document, Types } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}
interface Account extends Document{
  userID:Types.ObjectId;
  balance:Number;
  
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username must be unique"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    match: [
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "enter a valid email id",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [2, "password should of atleast 2 characters"],
  },
  firstname: {
    type: String,
    required: [true, "firstname is required"],
  },
  lastname: {
    type: String,
  },
});

const AccountSchema: Schema<Account> = new Schema({
  userID:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:[true,'user id is required for accounts']
  },
  balance:{
    type:Number,
    required:[true,'balance amount is required']
  }
})

export const UserModel = mongoose.model<User>("User", UserSchema);
export const AccountModel = mongoose.model<Account>("Account",AccountSchema);

