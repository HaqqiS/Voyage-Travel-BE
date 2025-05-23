import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import OrderModel, { orderDTO, OrderStatus, TypeOrder } from "../models/order.model";
import ParticipantModel from "../models/participant.model";
import response from "../utils/response";
import TourModel from "../models/tour.model";
import { calculateTotalPrice, countPersonByType } from "../helper/order.helper";
import { FilterQuery } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {
                ...req.body,
                createdBy: userId,
            } as TypeOrder;

            await orderDTO.validate(payload);

            const participant = await ParticipantModel.findById(payload.participant);
            if (!participant) return response.notFound(res, "participant not found");

            if (participant.totalPerson < 1) {
                response.error(res, null, "Participant total person must be greater than 1");
                return;
            }

            const tour = await TourModel.findById(payload.tour);
            if (!tour) return response.notFound(res, "tour not found");

            // const jumlahAdult: number = participant.person.filter(
            //     (person) => person.type === "adult",
            // ).length;
            // const jumlahChild: number = participant.person.filter(
            //     (person) => person.type === "child",
            // ).length;
            // const totalAdult = jumlahAdult * tour.price.adult;
            // const totalChild = jumlahChild * tour.price.child;
            // const total: number = totalAdult + totalChild;

            const jumlahAdult = countPersonByType(participant.person, "adult");
            const jumlahChild = countPersonByType(participant.person, "child");
            const total = calculateTotalPrice(jumlahAdult, jumlahChild, tour.price);

            Object.assign(payload, {
                ...payload,
                total,
            });

            const result = await OrderModel.create(payload);
            return response.success(res, result, "Order created successfully");
        } catch (error) {
            response.error(res, error, "Failed to create order");
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const buildQuery = (filter: any) => {
                let query: FilterQuery<TypeOrder> = {};

                if (filter.search) query.$text = { $search: filter.search };
                if (filter.status) query.status = filter.status;
                if (filter.participant) query.participant = filter.participant;
                if (filter.tour) query.tour = filter.tour;
                if (filter.createdBy) query.createdBy = filter.createdBy;

                return query;
            };

            //    const {limit = 10, page = 1, ...filter} = req.query;
            //    const query = buildQuery(filter);

            const {
                limit = 10,
                page = 1,
                search,
                status,
                participant,
                tour,
                createdBy,
            } = req.query;
            const query = buildQuery({
                search,
                status,
                participant,
                tour,
                createdBy,
            });

            const result = await OrderModel.find(query)
                .limit(+limit)
                .skip((+page - 1) * +limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            const count = await OrderModel.countDocuments(query);

            response.pagination(
                res,
                result,
                {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                },
                "success find all orders",
            );
        } catch (error) {
            response.error(res, error, "Failed to find order");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;
            const result = await OrderModel.findOne({
                orderId,
            });
            if (!result) response.notFound(res, "Order not found");
            return response.success(res, result, "Order found");
        } catch (error) {
            response.error(res, error, "Failed to find order");
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const buildQuery = (filter: any) => {
                let query: FilterQuery<TypeOrder> = {
                    createdBy: userId,
                };

                if (filter.search) query.$text = { $search: filter.search };
                if (filter.status) query.status = filter.status;
                if (filter.participant) query.participant = filter.participant;
                if (filter.tour) query.tour = filter.tour;

                return query;
            };

            const { limit = 10, page = 1, search } = req.query;
            const query = buildQuery({ search });

            const result = await OrderModel.find(query)
                .limit(+limit)
                .skip((+page - 1) * +limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            const count = await OrderModel.countDocuments(query);

            response.pagination(
                res,
                result,
                {
                    current: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                },
                "success find all orders by user",
            );
        } catch (error) {
            response.error(res, error, "Failed to find order");
        }
    },
    async complete(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;
            const userId = req.user?.id;

            const order = await OrderModel.findOne({
                orderId,
                createdBy: userId,
            });
            if (!order) return response.notFound(res, "Order not found");
            if (order.status === OrderStatus.COMPLETED) {
                response.error(res, null, "Order already completed");
                return;
            }

            const result = await OrderModel.findOneAndUpdate(
                { orderId, createdBy: userId },
                { status: OrderStatus.COMPLETED },
                { new: true },
            );

            return response.success(res, result, "Order completed successfully");
        } catch (error) {
            response.error(res, error, "Failed to complete order");
        }
    },
    async cancelled(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;
            const order = await OrderModel.findOne({ orderId });
            if (!order) return response.notFound(res, "Order not found");
            if (order.status === OrderStatus.CANCELLED) {
                response.error(res, null, "Order already cancelled");
                return;
            }
            if (order.status === OrderStatus.COMPLETED) {
                response.error(
                    res,
                    null,
                    "Order cannot be cancelled because it has been completed",
                );
                return;
            }

            const result = await OrderModel.findOneAndUpdate(
                { orderId },
                { status: OrderStatus.CANCELLED },
                { new: true },
            );

            return response.success(res, result, "Order cancelled successfully");
        } catch (error) {
            response.error(res, error, "Failed to cancelled order");
        }
    },
    async pending(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;

            const order = await OrderModel.findOne({
                orderId,
            });

            if (!order) return response.notFound(res, "order not found");

            if (order.status === OrderStatus.COMPLETED) {
                response.error(res, null, "this order has been completed");
                return;
            }

            if (order.status === OrderStatus.PENDING) {
                response.error(res, null, "this order currently in payment pending");
                return;
            }

            const result = await OrderModel.findOneAndUpdate(
                { orderId },
                { status: OrderStatus.PENDING },
                { new: true },
            );

            response.success(res, result, "success to pending an order");
        } catch (error) {
            response.error(res, error, "failed to pending an order");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;
            const result = await OrderModel.findOneAndDelete({ orderId }, { new: true });
            if (!result) response.notFound(res, "Order not found");
            return response.success(res, result, "Order deleted successfully");
        } catch (error) {
            response.error(res, error, "Failed to delete order");
        }
    },
};
