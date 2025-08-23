import { Router } from "express";
import { SignupUser } from "../controllers/users.controllers.js";

import { LoginUser } from "../controllers/users.controllers.js";

const router=Router();

// router.route("/Signup").post(SignupUser)
// router.route("/Login").post(LoginUser);
router.route("/Signup").post(SignupUser)
router.route("/Login").post(LoginUser);


export default router;


//http://localhost:8000/api/users/delete/09489.. id
//http://localhost:8000/api/users/getUser  - get req


// import { Router } from "express";

// const router=Router();

// router.route('/register').post();

// export default router;


