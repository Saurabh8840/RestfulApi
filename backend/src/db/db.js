import mongoose from "mongoose"
import dotenv from "dotenv"
import { DB_NAME } from "../constant.js"

dotenv.config({path:'./.env'})

const connectDB=async()=>{
   
    try{
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb connect !! db host ${connectionInstance.connection.host}`);
    }catch(error){
          console.log("mongodb connection error ",error)
          process.exit(1)
    }
}

export default connectDB;



