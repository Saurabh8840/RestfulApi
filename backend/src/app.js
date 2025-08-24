import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app=express();
//middleware



app.use(express.json());


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());



import userRouter from "./routes/user.route.js"
import userdashboard from "./routes/dashboard.route.js"
import { verifyjwt } from "./middleware/authmiddleware.js";
//route
//route
app.use("/api/users", userRouter)
app.use("/api/dashboard",verifyjwt,userdashboard)


export {app}

