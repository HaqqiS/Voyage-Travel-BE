import { customAlphabet } from "nanoid";

export const getId = (name: string, length: number): string => {
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);
    return `${name.toUpperCase()}-${nanoid(length)}`;
};
