import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import TourModel, { TourDTO, TypeTour } from "../models/tour.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await TourDTO.validate(req.body);
            const result = await TourModel.create(req.body);
            response.success(res, result, "Tour created successfully");
        } catch (error) {
            response.error(res, error, "Failed to create tour");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const { limit = 10, page = 1, startDate, duration, minPrice, maxPrice, destination, search } = req.query;

            const buildQuery = (filter: any): FilterQuery<TypeTour> => {
                let query: FilterQuery<TypeTour> = {};

                // Filter berdasarkan tanggal
                if (startDate) {
                    const date = new Date(startDate as string);
                    query.$or = [
                        { "availability.fixedDates": date },
                        { "availability.availableDays": { $exists: true, $ne: [] } } // Tour yang berulang
                    ];
                }

                // Filter berdasarkan durasi
                if (duration) query.duration = { $eq: +duration };

                // Filter berdasarkan harga
                if (minPrice || maxPrice) {
                    query["price.adult"] = {};
                    if (minPrice) query["price.adult"].$gte = +minPrice;
                    if (maxPrice) query["price.adult"].$lte = +maxPrice;
                }

                // Filter berdasarkan destinasi
                if (destination && isValidObjectId(destination as string)) {
                    query.destination = destination as string;
                }

                // Full-text search berdasarkan judul
                if (search) query.$text = { $search: search as string };

                return query;
            };

            const query = buildQuery(req.query);

            const results = await TourModel.find(query)
                .limit(+limit)
                .skip((+page - 1) * +limit)
                .sort({ createdAt: -1 }) // Sorting terbaru dulu
                .lean()
                .exec();
            const count = await TourModel.countDocuments(query);

            response.pagination(
                res,
                results,
                {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                },
                "Tours found successfully"
            );
        } catch (error) {
            response.error(res, error, "Failed to fetch tours");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Tour not found");
            }

            const result = await TourModel.findById(id).lean().exec();

            if (!result) {
                return response.notFound(res, "Tour not found");
            }

            response.success(res, result, "Tour found successfully");
        } catch (error) {
            response.error(res, error, "Failed to fetch tour");
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Invalid tour ID");
            }

            await TourDTO.validate(req.body);
            const result = await TourModel.findByIdAndUpdate(id, req.body, { new: true });

            if (!result) return response.notFound(res, "Tour not found");

            response.success(res, result, "Tour updated successfully");
        } catch (error) {
            response.error(res, error, "Failed to update tour");
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Invalid tour ID");
            }

            const result = await TourModel.findByIdAndDelete(id);

            if (!result) return response.notFound(res, "Tour not found");

            response.success(res, result, "Tour deleted successfully");
        } catch (error) {
            response.error(res, error, "Failed to delete tour");
        }
    },

    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;

            if (!slug) {
                return response.notFound(res, "Tour not found");
            }

            const result = await TourModel.findOne({ slug }).lean().exec();

            if (!result) {
                return response.notFound(res, "Tour not found");
            }

            response.success(res, result, "Tour found successfully");
        } catch (error) {
            response.error(res, error, "Failed to fetch tour");
        }
    }
};
