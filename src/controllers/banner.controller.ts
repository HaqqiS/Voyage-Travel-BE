import { IReqUser } from "../utils/interfaces";
import { Response } from "express";
import response from "../utils/response";
import BannerModel, { bannerDTO, TypeBanner } from "../models/banner.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await bannerDTO.validate(req.body);
            const result = await BannerModel.create(req.body);
            response.success(res, result, "Banner created successfully");
        } catch (error) {
            response.error(res, error, "Failed to create banner");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const buildQuery = (filter: any) => {
                let query: FilterQuery<TypeBanner> = {};

                if (filter.isShow) query.isShow = filter.isShow;

                return query;
            };

            const { limit = 10, page = 1, search, isShow } = req.query;
            const query = buildQuery({
                search,
                isShow,
            });

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search,
                    },
                });
            }
            const result = await BannerModel.find(query)
                .limit(+limit)
                .skip((+page - 1) * +limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await BannerModel.countDocuments(query);

            response.pagination(
                res,
                result,
                { current: +page, total: count, totalPages: Math.ceil(count / +limit) },
                "Banners retrieved successfully",
            );
        } catch (error) {
            response.error(res, error, "Failed find all banners");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed to find banner");
            }
            const result = await BannerModel.findById(id);
            if (!result) {
                return response.notFound(res, "Banner not found");
            }
            response.success(res, result, "Banner retrieved successfully");
        } catch (error) {
            response.error(res, error, "Failed to find banner");
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            // await bannerDTO.validate(req.body);
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed to find banner");
            }
            const result = await BannerModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!result) {
                return response.notFound(res, "Banner not found");
            }
            response.success(res, result, "Banner updated successfully");
        } catch (error) {
            response.error(res, error, "Failed to update banner");
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed to find banner");
            }
            const result = await BannerModel.findByIdAndDelete(id);
            if (!result) {
                return response.notFound(res, "Banner not found");
            }
            response.success(res, result, "Banner deleted successfully");
        } catch (error) {
            response.error(res, error, "Failed to delete banner");
        }
    },
};
