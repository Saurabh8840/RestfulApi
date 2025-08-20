import { User } from "../models/user.models.js";
import { userDetail } from "../models/userdetails.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { z } from "zod";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await userDetail.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    //SAVE AS WELL
    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });

    return { AccessToken, RefreshToken };
  } catch (error) {
    console.log("Token generation failed", error);
    throw new ApiError(500, "something went wrong");
  }
};

//get all user
export const getUser = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

//new user
export const newUser = async (req, res) => {
  const { Name, email, age } = req.body;

  const newUser = await User.create({
    Name: Name,
    email: email,
    age: age,
  });

  newUser.save();

  res.status(201).json(newUser);
};

//update new user
export const updateUser = async (req, res) => {
  const { Name, age } = req.body;
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        Name: Name,
        age: age,
      },
    },
    { new: true }
  );

  res.status(200).json(user);
};

//delete user

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.json({ message: "User deleted " });
};

export const SignupUser = asyncHandler(async (req, res) => {
  //user details
  const { username, email, password } = req.body;

  //validation
  // if(!username & !email & !password){
  //     throw new ApiError(400,"input details are required")
  // }

  //above will not work because id username is filled and email empty is pass

  //2nd app
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  //best case using zod

  //check if email aready exist or not
  const existingUser = await userDetail.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const User = await userDetail.create({
    username,
    email,
    password,
  });

  const createdUser = await userDetail.findById(User._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});


export const LoginUser = asyncHandler(async (req, res) => {
  //user details
  const { email, password } = req.body;

  //validation
  if (
    [email, password].some((field) =>field?.trim() === "")
  ) {
    throw new ApiError(400, "enter input values");
  }

  //find user
  const user =await  userDetail.findOne({email});

  if (!user) {
    throw new ApiError(404, "user doesn't exist");
  }

  //check password

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(400, "incorrect password");
  }

  //generate token it should be in method bcz it have to be done several times
  const { RefreshToken, AccessToken } =await generateAccessAndRefreshToken(user._id);

  const loggeduser = await userDetail
    .findById(user._id)
    .select(" -password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggeduser,
          AccessToken,
          RefreshToken,
        },
        "User logged in successfully"
      )
    );
});

