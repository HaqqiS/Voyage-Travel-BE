import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
});

export default {
    single(filedName: string) {
        return upload.single(filedName);
    },
    multiple(fieldName: string) {
        return upload.array(fieldName);
    },
};
