import mongoose, { ObjectId, Schema } from "mongoose";
import * as Yup from "yup";
import { USERS_MODEL_NAME } from "./user.model";
import { TOUR_MODEL_NAME } from "./tour.model";

export const PARTICIPANT_MODEL_NAME = "Participant";

export const PERSON_TYPE = {
    ADULT: "adult",
    CHILD: "child",
};

export const personDTO = Yup.object({
    name: Yup.string().required(),
    type: Yup.string().required().oneOf([PERSON_TYPE.ADULT, PERSON_TYPE.CHILD]),
});

export const participantDTO = Yup.object({
    createdBy: Yup.string().required(),
    tour: Yup.string().required(),
    person: Yup.array().of(personDTO).required(),
    totalPerson: Yup.number().required().min(1, "Must have at least 1 participant"),
});

export type TypeParticipant = Yup.InferType<typeof participantDTO>;

interface Participant extends Omit<TypeParticipant, "createdBy" | "tour"> {
    createdBy: ObjectId;
    tour: ObjectId;
}

const personSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    type: {
        type: Schema.Types.String,
        required: true,
        enum: [PERSON_TYPE.ADULT, PERSON_TYPE.CHILD],
    },
});

const participantSchema = new Schema<Participant>(
    {
        createdBy: { type: Schema.Types.ObjectId, required: true, ref: USERS_MODEL_NAME },
        tour: { type: Schema.Types.ObjectId, required: true, ref: TOUR_MODEL_NAME },
        person: { type: [personSchema], required: true },
        totalPerson: { type: Number, required: true, min: 1 },
    },
    { timestamps: true },
).index({ tour: "text", createdBy: "text", person: "text" });

const ParticipantModel = mongoose.model(PARTICIPANT_MODEL_NAME, participantSchema);

export default ParticipantModel;
