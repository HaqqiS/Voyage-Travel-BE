import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;
export const DESTINATION_MODEL_NAME = "Destination";

export const destinationDTO = Yup.object({
    name: Yup.string().required(),
    country: Yup.string().required(),
    description: Yup.string().required(),
    images: Yup.array().of(Yup.string()).required(),
    attractions: Yup.array().of(Yup.string()).required(),
});

export type TypeDestination = Yup.InferType<typeof destinationDTO>;

const destinationSchema = new Schema<TypeDestination>(
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
            type: [Schema.Types.String],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const DestinationModel = mongoose.model(DESTINATION_MODEL_NAME, destinationSchema);

export default DestinationModel;
