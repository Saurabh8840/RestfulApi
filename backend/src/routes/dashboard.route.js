
import { Router } from "express";
import { getUser } from "../controllers/users.controllers.js";
import { newUser } from "../controllers/users.controllers.js";
import { updateUser } from "../controllers/users.controllers.js";
import { deleteUser } from "../controllers/users.controllers.js";


const router=Router();


router.route("/getusers").get(getUser);
router.route("/newuser").post(newUser)
router.route("/updateUser/:id").put(updateUser)
router.route("/delete/:id").delete(deleteUser)

export default router;

