import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import uploader from "../utils/uploader";

export default {
    async single(req: IReqUser, res: Response) {
        if (!req.file) return response.error(res, null, "File not found");
        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);
            return response.success(res, result, "File uploaded successfully");
        } catch (error) {
            response.error(res, error, "Failed to upload file");
        }
    },
    async multiple(req: IReqUser, res: Response) {
        if (!req.files || req.files.length === 0)
            return response.error(res, null, "File not found");
        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            return response.success(res, result, "Files uploaded successfully");
        } catch (error) {
            response.error(res, error, "Failed to upload file");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string };
            if (!fileUrl) return response.error(res, null, "File URL not found");

            const result = await uploader.remove(fileUrl);
            return response.success(res, result, "File removed successfully");
        } catch (error) {
            response.error(res, error, "Failed to remove file");
        }
    },
};
