import express from "express";
import {Registration, Login} from "../controller/authController.js";
import {authenticateUser} from "../middleware/authMiddleware.js";
import { userDelete, userGet, userPut} from "../controller/authController.js";

const router = express.Router();

router.post("/register", Registration);
router.post("/login", Login);
router.get("/userdetails", authenticateUser, userGet)
router.put("/edit/:id", authenticateUser,userPut)
router.delete("/delete/:id", authenticateUser, userDelete)



export default router;
