import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { Response } from "express";
import response from "../utils/response";
import ParticipantModel, { participantDTO } from "../models/participant.model";
import { isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await participantDTO.validate(req.body);

            const result = await ParticipantModel.create(req.body);
            response.success(res, result, "Participant created successfully");
        } catch (error) {
            response.error(res, error, "Failed to create participant");
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;
        try {
            const query = {};
            if (search) {
                Object.assign(query, {
                    $or: [{ "person.name": { $regex: search, $options: "i" } }],
                });
            }

            const result = await ParticipantModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();
            const count = await ParticipantModel.countDocuments(query);

            response.pagination(
                res,
                result,
                { total: count, totalPages: Math.ceil(count / limit), current: page },
                "Participants retrieved successfully",
            );
        } catch (error) {
            response.error(res, error, "Failed to get participants");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) return response.notFound(res, "Participant not found");

            const result = await ParticipantModel.findById(id);
            if (!result) return response.notFound(res, "Participant not found");

            response.success(res, result, "Participant retrieved successfully");
        } catch (error) {
            response.error(res, error, "Failed to get participant");
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) return response.notFound(res, "Participant not found");

            const result = await ParticipantModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!result) return response.notFound(res, "Participant not found");

            response.success(res, result, "Participant updated successfully");
        } catch (error) {
            response.error(res, error, "Failed to update participant");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) return response.notFound(res, "Participant not found");

            const result = await ParticipantModel.findByIdAndDelete(id);
            if (!result) return response.notFound(res, "Participant not found");

            response.success(res, result, "Participant deleted successfully");
        } catch (error) {
            response.error(res, error, "Failed to delete participant");
        }
    },
};
