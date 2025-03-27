import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;
export const DESTINATION_MODEL_NAME = "Destination";

export const attractionDTO = Yup.object({
    _id: Yup.string(),
    name: Yup.string().required(),
});

export const destinationDTO = Yup.object({
    name: Yup.string().required(),
    country: Yup.string().required(),
    description: Yup.string().required(),
    images: Yup.array().of(Yup.string()).required(),
    attractions: Yup.array().of(attractionDTO).required(),
});

export type TypeDestination = Yup.InferType<typeof destinationDTO>;

export interface Destination extends Omit<TypeDestination, "_id"> {
    _id: ObjectId;
}

const attractionSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
});

const destinationSchema = new Schema<Destination>(
    {
        name: {
            type: Schema.Types.String,
            required: true,
        },
        country: {
            type: Schema.Types.String,
            required: true,
        },
        description: {
            type: Schema.Types.String,
            required: true,
        },
        images: {
            type: [Schema.Types.String],
            required: true,
            default: [],
        },
        attractions: {
            type: [attractionSchema],
            required: true,
            default: [],
        },
    },
    {
        timestamps: true,
    },
).index({ name: "text", country: "text" });

const DestinationModel = mongoose.model(DESTINATION_MODEL_NAME, destinationSchema);

export default DestinationModel;
