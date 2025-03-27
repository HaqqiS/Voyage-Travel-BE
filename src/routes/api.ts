import express from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import destinationController from "../controllers/destination.controller";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";
import tourController from "../controllers/tour.controller";
import bannerController from "../controllers/banner.controller";
import participantController from "../controllers/participant.controller";

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
    #swagger.parameters['search'] = {
        in: 'query',
        type: 'string',
        description: "Search by destination name"
    }
    */
);
router.get(
    "/destinations/:id",
    destinationController.findOne,
    /*
    #swagger.tags = ['Destinations']
    #swagger.summary = 'Get a destination by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Destination ID"
    }
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
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Destination ID"
    }
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
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Destination ID"
    }
    */
);

router.post(
    "/tours",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    tourController.create,
    /*
    #swagger.tags = ['Tours']
    #swagger.summary = 'Create a new tour'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/TourRequest"
        }
    }
    */
);
router.get(
    "/tours",
    tourController.findAll,
    /*
    #swagger.tags = ['Tours']
    #swagger.summary = 'Get all tours'
    #swagger.parameters['limit'] = {
        in: 'query',
        type: 'number',
        default: 10
    }
    #swagger.parameters['page'] = {
        in: 'query',
        type: 'number',
        default: 1
    }
    #swagger.parameters['startDate'] = {
        in: 'query',
        type: 'string',
        format: 'date',
        description: "Filter by available tour date (YYYY-MM-DD)"
    }
    #swagger.parameters['duration'] = {
        in: 'query',
        type: 'number',
        description: "Filter by tour duration (days)"
    }
    #swagger.parameters['minPrice'] = {
        in: 'query',
        type: 'number',
        description: "Minimum price for adult"
    }
    #swagger.parameters['maxPrice'] = {
        in: 'query',
        type: 'number',
        description: "Maximum price for adult"
    }
    #swagger.parameters['destination'] = {
        in: 'query',
        type: 'string',
        description: "Filter by destination ID"
    }
    #swagger.parameters['search'] = {
        in: 'query',
        type: 'string',
        description: "Search by tour title"
    }
    */
);
router.get(
    "/tours/:id",
    tourController.findOne,
    /*
    #swagger.tags = ['Tours']
    #swagger.summary = 'Get a tour by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Tour ID"
    }
    */
);
router.get(
    "/tours/:slug/slug",
    tourController.findOneBySlug,
    /*
    #swagger.tags = ['Tours']
    #swagger.summary = 'Get a tour by slug'
    #swagger.parameters['slug'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Tour slug"
    }
    */
);
router.put(
    "/tours/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    tourController.update,
    /*
    #swagger.tags = ['Tours']
    #swagger.summary = 'Update a tour'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Tour ID"
    }
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/TourRequest"
        }
    }
    */
);
router.delete(
    "/tours/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    tourController.delete,
    /*
    #swagger.tags = ['Tours']
    #swagger.summary = 'Delete a tour'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Tour ID"
    }
    */
);

router.post(
    "/banners",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.create,
    /*
    #swagger.tags = ['Banners']
    #swagger.summary = 'Create a new banner'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/BannerRequest"
        }
    }
    */
);
router.get(
    "/banners",
    bannerController.findAll,
    /*
    #swagger.tags = ['Banners']
    #swagger.summary = 'Get all banners'
    #swagger.parameters['isShow'] = {
        in: 'query',
        type: 'boolean'
    }
    */
);
router.get(
    "/banners/:id",
    bannerController.findOne,
    /*
    #swagger.tags = ['Banners']
    #swagger.summary = 'Get a banner by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Banner ID"
    }
    */
);
router.put(
    "/banners/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.update,
    /*
    #swagger.tags = ['Banners']
    #swagger.summary = 'Update a banner'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Banner ID"
    }
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/BannerRequest"
        }
    }
    */
);
router.delete(
    "/banners/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.delete,
    /*
    #swagger.tags = ['Banners']
    #swagger.summary = 'Delete a banner'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Banner ID"
    }
    */
);

router.post(
    "/participants",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    participantController.create,
    /*
    #swagger.tags = ['Participants']
    #swagger.summary = 'Create a new participant'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/ParticipantRequest"
        }
    }
    */
);

router.get(
    "/participants",
    participantController.findAll,
    /*
    #swagger.tags = ['Participants']
    #swagger.summary = 'Get all participants'
    #swagger.parameters['limit'] = {
        in: 'query',
        type: 'number',
        default: 10
    }
    #swagger.parameters['page'] = {
        in: 'query',
        type: 'number',
        default: 1
    }
    #swagger.parameters['search'] = {
        in: 'query',
        type: 'string',
        description: "Search by participant name"
    }
    */
);

router.get(
    "/participants/:id",
    participantController.findOne,
    /*
    #swagger.tags = ['Participants']
    #swagger.summary = 'Get a participant by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Participant ID"
    }
    */
);

router.put(
    "/participants/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    participantController.update,
    /*
    #swagger.tags = ['Participants']
    #swagger.summary = 'Update a participant'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Participant ID"
    }
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/ParticipantRequest"
        }
    }
    */
);

router.delete(
    "/participants/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    participantController.remove,
    /*
    #swagger.tags = ['Participants']
    #swagger.summary = 'Delete a participant'
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: "Participant ID"
    }
    */
);

export default router;
