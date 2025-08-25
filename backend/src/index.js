
import connectDB from "./db/db.js";
import dotenv from "dotenv"
import express from "express"
import { app } from "./app.js";



// dotenv.config({path:"./.env"});

dotenv.config({path:"./.env"});

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running at port :${process.env.PORT}`);

    })
})
.catch((err)=>{
    console.log("mongodb connection failed!!",err);
})

export default connectDB;


