import { customAlphabet } from "nanoid";

export const getId = async (name: string, length: number): Promise<string> => {
    const { customAlphabet } = await import('nanoid');
    const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);
    return `${name.toUpperCase()}-${nanoid(length)}`;
};
