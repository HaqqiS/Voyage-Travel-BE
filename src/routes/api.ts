import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import destinationController from "../controllers/destination.controller";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

router.get("/auth/google", authController.googleAuthUrl);
router.get("/auth/google/callback", authController.googleCallback);

router.post(
    "/media/upload-single",
    [authMiddleware, aclMiddleware([ROLES.ADMIN]), mediaMiddleware.single("file")],
    mediaController.single,
);
router.post(
    "/media/upload-multiple",
    [authMiddleware, aclMiddleware([ROLES.ADMIN]), mediaMiddleware.multiple("files")],
    mediaController.multiple,
);
router.delete(
    "/media/remove",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    mediaController.remove,
);

router.post(
    "/destinations",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    destinationController.create,
);
router.get("/destinations", destinationController.findAll);
router.get("/destinations/:id", destinationController.findOne);
router.put(
    "/destinations/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    destinationController.update,
);
router.delete(
    "/destinations/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    destinationController.remove,
);

export default router;
