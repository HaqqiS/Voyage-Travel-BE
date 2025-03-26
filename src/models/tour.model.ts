import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";
import { DESTINATION_MODEL_NAME } from "./destination.model";

export const TOUR_MODEL_NAME = "Tour";

const Schema = mongoose.Schema;

// Schema untuk itinerary
export const itineraryDTO = Yup.object({
    day: Yup.number().required().min(1, "Day must be at least 1"),
    detail: Yup.string().required(),
    image: Yup.string().required(),
});

// Schema untuk harga per peserta
export const priceDTO = Yup.object({
    adult: Yup.number().required().min(0, "Price cannot be negative"),
    child: Yup.number().required().min(0, "Price cannot be negative"),
});

// Schema untuk ketersediaan tour
export const availabilityDTO = Yup.object({
    availableDays: Yup.array()
        .of(
            Yup.string().oneOf([
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ]),
        )
        .when("isRecurring", {
            is: true,
            then: (schema) => schema.required("Available days are required for recurring tours"),
            otherwise: (schema) => schema.nullable(),
        }),
    fixedDates: Yup.array()
        .of(Yup.date().min(new Date(), "Fixed date must be in the future"))
        .when("isRecurring", {
            is: false,
            then: (schema) => schema.required("Fixed dates are required for non-recurring tours"),
            otherwise: (schema) => schema.nullable(),
        }),
});

// Schema utama Tour
export const tourDTO = Yup.object({
    title: Yup.string().required(),
    slug: Yup.string(),
    destination: Yup.string().required(),
    description: Yup.string().required(),
    itinerary: Yup.array()
        .of(itineraryDTO)
        .required()
        .min(1, "At least one itinerary item is required"),
    maxParticipant: Yup.number().required().min(1, "Must have at least 1 participant"),
    isRecurring: Yup.boolean().default(false),
    duration: Yup.number().required().min(1, "Must have at least 1 day"),
    availability: availabilityDTO.required(),
    price: priceDTO.required(),
});

export type TypeTour = Yup.InferType<typeof tourDTO>;

export interface Tour extends Omit<TypeTour, "destination"> {
    destination: ObjectId;
}

// Schema Mongoose untuk itinerary
const itinerarySchema = new Schema(
    {
        day: { type: Number, required: true, min: 1 },
        detail: { type: String, required: true },
        image: { type: String, required: true },
    },
    { _id: false },
);

// Schema Mongoose untuk harga
const priceSchema = new Schema(
    {
        adult: { type: Number, required: true, min: 0 },
        child: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

// Schema Mongoose untuk ketersediaan
const availabilitySchema = new Schema(
    {
        availableDays: { type: [String], default: null },
        fixedDates: { type: [Date], default: null },
    },
    { _id: false },
);

// Schema utama Tour
const TourSchema = new Schema<Tour>(
    {
        title: { type: Schema.Types.String, required: true },
        slug: { type: Schema.Types.String, unique: true },
        destination: { type: Schema.Types.ObjectId, required: true, ref: DESTINATION_MODEL_NAME },
        description: { type: Schema.Types.String, required: true },
        itinerary: { type: [itinerarySchema], required: true },
        maxParticipant: { type: Schema.Types.Number, required: true, min: 1 },
        isRecurring: { type: Boolean, required: true, default: false },
        duration: { type: Schema.Types.Number, required: true, min: 1 },
        availability: { type: availabilitySchema, required: true },
        price: { type: priceSchema, required: true },
    },
    { timestamps: true },
).index({ title: "text" });

TourSchema.pre("save", function () {
    if (!this.slug) {
        const slug = this.title.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const TourModel = mongoose.model(TOUR_MODEL_NAME, TourSchema);

export default TourModel;
