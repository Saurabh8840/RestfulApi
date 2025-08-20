import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const userDetailSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamp: true }
);

//bcrypt password
userDetailSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await  bcrypt.hash(this.password, 10);
  next();
});

//custome method to check is password correct
// userDetailSchema.method.isPasswordCorrect=async function(password){
//        return await bcrypt.compare(password,this.password)
// }

userDetailSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

//model
userDetailSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userDetailSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email:this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const userDetail = mongoose.model("userDetail", userDetailSchema);
