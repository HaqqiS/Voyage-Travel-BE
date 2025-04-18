import * as Yup from "yup";
import mongoose, { mongo, ObjectId, Schema } from "mongoose";
import payment, { TypeResponseMidtrans } from "../utils/payment";
import { USERS_MODEL_NAME } from "./user.model";
import { TOUR_MODEL_NAME } from "./tour.model";
import { PARTICIPANT_MODEL_NAME } from "./participant.model";
import { getId } from "../utils/id";

export const ORDER_MODEL_NAME = "Order";

export const orderDTO = Yup.object({
    createdBy: Yup.string().required(),
    tour: Yup.string().required(),
    participant: Yup.string().required(),
});

export type TypeOrder = Yup.InferType<typeof orderDTO>;

export enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export interface Order extends Omit<TypeOrder, "createdBy" | "tour" | "participant"> {
    total: number;
    status: string;
    payment: TypeResponseMidtrans;
    createdBy: ObjectId;
    tour: ObjectId;
    participant: ObjectId;
    orderId: string;
}

const OrderSchema = new Schema<Order>(
    {
        orderId: {
            type: Schema.Types.String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: USERS_MODEL_NAME,
            required: true,
        },
        tour: {
            type: Schema.Types.String,
            ref: TOUR_MODEL_NAME,
            required: true,
        },
        total: {
            type: Schema.Types.Number,
            required: true,
        },
        payment: {
            type: {
                token: {
                    type: Schema.Types.String,
                    required: true,
                },
                redirect_url: {
                    type: Schema.Types.String,
                    required: true,
                },
            },
        },
        status: {
            type: Schema.Types.String,
            enum: [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
            default: OrderStatus.PENDING,
        },
        participant: {
            type: Schema.Types.ObjectId,
            ref: PARTICIPANT_MODEL_NAME,
            required: true,
        },
    },
    {
        timestamps: true,
    },
).index({ orderId: "text" });

OrderSchema.pre("save", async function () {
    const order = this;
    order.orderId = await getId("order", 8);
    order.payment = await payment.createLink({
        transaction_details: {
            gross_amount: order.total,
            order_id: order.orderId,
        },
    });
});

const OrderModel = mongoose.model(ORDER_MODEL_NAME, OrderSchema);

export default OrderModel;
