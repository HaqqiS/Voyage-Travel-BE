import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import destinationController from "../controllers/destination.controller";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

router.get("/auth/google", authController.googleLogin);
router.get("/auth/google/callback", authController.googleCallback);

router.post("/destinations", [authMiddleware, aclMiddleware([ROLES.ADMIN])], destinationController.create);
router.get("/destinations", destinationController.findAll);
router.get("/destinations/:id", destinationController.findOne);

export default router;
