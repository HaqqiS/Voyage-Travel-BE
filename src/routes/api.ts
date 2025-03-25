import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import destinationController from "../controllers/destination.controller";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";

const router = express.Router();

router.post(
    "/auth/register",
    authController.register,
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Register a new user'
    #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/RegisterRequest"}
    }
    */
);
router.post(
    "/auth/login",
    authController.login,
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Login user'
    #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/LoginRequest"}
    }
    */
);
router.get(
    "/auth/me",
    authMiddleware,
    authController.me,
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Get current user information'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    */
);

router.get(
    "/auth/google",
    authController.googleAuthUrl,
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Get Google authentication URL'
    */
);
router.get(
    "/auth/google/callback",
    authController.googleCallback,
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Get Google authentication callback'
    */
);

router.post(
    "/media/upload-single",
    [authMiddleware, aclMiddleware([ROLES.ADMIN]), mediaMiddleware.single("file")],
    mediaController.single,
    /*
    #swagger.tags = ['Media']
    #swagger.summary = 'Upload a single file'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        file: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }    
    */
);
router.post(
    "/media/upload-multiple",
    [authMiddleware, aclMiddleware([ROLES.ADMIN]), mediaMiddleware.multiple("files")],
    mediaController.multiple,
    /*
    #swagger.tags = ['Media']
    #swagger.summary = 'Upload multiple files'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        files: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                }
            }
        }
    }    
    */
);
router.delete(
    "/media/remove",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    mediaController.remove,
    /*
    #swagger.tags = ['Media']
    #swagger.summary = 'Remove media'
    #swagger.security = [{
        bearerAuth: []
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/RemoveMediaRequest"
        }
    }
    */
);

router.post(
    "/destinations",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    destinationController.create,
    /*
    #swagger.tags = ['Destinations']
    #swagger.summary = 'Create a new destination'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/DestinationRequest"
        }
    }
    */
);
router.get(
    "/destinations",
    destinationController.findAll,
    /*
    #swagger.tags = ['Destinations']
    #swagger.summary = 'Get all destinations'
    */
);
router.get(
    "/destinations/:id",
    destinationController.findOne,
    /*
    #swagger.tags = ['Destinations']
    #swagger.summary = 'Get a destination by ID'
    */
);
router.put(
    "/destinations/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    destinationController.update,
    /*
    #swagger.tags = ['Destinations']
    #swagger.summary = 'Update a destination'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/DestinationRequest"
        }
    }
    */
);
router.delete(
    "/destinations/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    destinationController.remove,
    /*
    #swagger.tags = ['Destinations']
    #swagger.summary = 'Delete a destination'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    */
);

export default router;
