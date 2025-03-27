import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import DestinationModel, { destinationDTO, TypeDestination } from "../models/destination.model";
import { FilterQuery, isValidObjectId } from "mongoose";
import uploader from "../utils/uploader";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await destinationDTO.validate(req.body);
            const result = await DestinationModel.create(req.body);

            response.success(res, result, "Destination created successfully");
        } catch (error) {
            response.error(res, error, "Error creating destination");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const buildQuery = (filter: any) => {
                let query: FilterQuery<TypeDestination> = {};

                if (filter.search) query.$text = { $search: filter.search };

                return query;
            };

            const { limit = 10, page = 1, search } = req.query;
            const query = buildQuery({
                search,
            });

            const result = await DestinationModel.find(query)
                .limit(+limit)
                .skip((+page - 1) * +limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();
            const count = await DestinationModel.countDocuments(query);

            response.pagination(
                res,
                result,
                {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                },
                "Destinations found successfully",
            );
        } catch (error) {
            response.error(res, error, "Error findAll destinations");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Destination not found");
            }
            const result = await DestinationModel.findById(id);

            if (!result) {
                return response.notFound(res, "Destination not found");
            }

            response.success(res, result, "Destination retrieved successfully");
        } catch (error) {
            response.error(res, error, "Error findOne destination");
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Destination not found");
            }

            const result = await DestinationModel.findByIdAndUpdate(id, req.body, { new: true });

            if (!result) return response.notFound(res, "Destination not found");

            response.success(res, result, "Destination updated successfully");
        } catch (error) {
            response.error(res, error, "Error updating destination");
        }
    },

    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Destination not found");
            }

            const result = await DestinationModel.findByIdAndDelete(id, { new: true });

            if (!result) {
                return response.notFound(res, "Destination not found");
            }

            if (Array.isArray(result?.images) && result.images.length > 0) {
                for (const image of result.images) {
                    if (typeof image === "string") {
                        await uploader.remove(image);
                    }
                }
            }

            response.success(res, result, "Destination deleted successfully");
        } catch (error) {
            response.error(res, error, "Error deleting destination");
        }
    },
};
