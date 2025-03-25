import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Voyage Travel",
        description: "Dokumentasi API Voyage Travel",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local server",
        },
        {
            url: "https://back-end-acara-sand.vercel.app/api  ",
            description: "Deploy server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            RegisterRequest: {
                fullName: "Haqqi Sukmara Ishfahani",
                username: "HqiSkmr",
                email: "hqi@mail.com",
                password: "H12345678",
                confirmPassword: "H12345678",
            },
            LoginRequest: {
                identifier: "hqi@mail.com/HqiSkmr",
                password: "H12345678",
            },
            RemoveMediaRequest: {
                fileUrl:
                    "https://res.cloudinary.com/dh1nhrlhu/image/upload/v1740468415/a9njgyhcqpm1zlbqu2ck.jpg",
            },
            DestinationRequest: {
                name: "Raja Ampat",
                country: "Indonesia",
                description: "Destiansi ke raja ampat",
                images: [
                    "https://res.cloudinary.com/dh1nhrlhu/image/upload/v1742823904/aiztnavnm1bbavwuxwkf.jpg",
                    "https://res.cloudinary.com/dh1nhrlhu/image/upload/v1742823903/bpbho5y1kfiwdj83jo2s.jpg",
                ],
                attractions: ["Pantai Batu Bolong", "Pura Besakih"],
            },
        },
    },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({
    openapi: "3.0.0",
})(outputFile, endpointsFiles, doc);
