import mongoose, { Schema } from "mongoose";
import * as Yup from "yup";

export const BANNER_MODEL_NAME = "Banner";

export const bannerDTO = Yup.object({
    title: Yup.string().required(),
    image: Yup.string().required(),
    isShow: Yup.boolean().required(),
});

export type TypeBanner = Yup.InferType<typeof bannerDTO>;

interface Banner extends TypeBanner {}

const bannerSchema = new Schema<Banner>(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        isShow: { type: Boolean, required: true },
    },
    { timestamps: true },
);

const BannerModel = mongoose.model(BANNER_MODEL_NAME, bannerSchema);

export default BannerModel;
