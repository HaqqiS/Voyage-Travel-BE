import path from "path";
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
            url: "https://voyage-travel-be.vercel.app/api",
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
                fullname: "Haqqi Sukmara Ishfahani",
                username: "HqiSkmr",
                email: "hqi@mail.com",
                password: "H12345678",
                confirmPassword: "H12345678",
            },
            LoginRequest: {
                identifier: "hqi@mail.com",
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
            TourRequest: {
                title: "Tour to Raja Ampat",
                slug: "tour-to-raja-ampat",
                destination: "65a2d1f7d1e42b001e8b5f60",
                description:
                    "Explore the breathtaking beauty of Raja Ampat with this exclusive tour package.",
                itinerary: [
                    {
                        day: 1,
                        detail: "Day 1: Arrival in Raja Ampat, check-in at the resort, and enjoy a welcome dinner.",
                        image: "https://res.cloudinary.com/dh1nhrlhu/image/upload/v1742823904/aiztnavnm1bbavwuxwkf.jpg",
                    },
                    {
                        day: 2,
                        detail: "Day 2: Snorkeling at famous dive sites and island hopping.",
                        image: "https://res.cloudinary.com/dh1nhrlhu/image/upload/v1742823903/bpbho5y1kfiwdj83jo2s.jpg",
                    },
                ],
                maxParticipant: 10,
                isRecurring: false,
                duration: 3,
                availability: {
                    //kalau isRecurring: true,
                    // availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    // fixedDates: []
                    availableDays: [],
                    fixedDates: ["2025-06-15", "2025-07-20", "2025-08-10"],
                },
                price: {
                    adult: 2000000,
                    child: 1500000,
                },
            },
            BannerRequest: {
                title: "Banner 1",
                image: "https://res.cloudinary.com/dh1nhrlhu/image/upload/v1742823904/aiztnavnm1bbavwuxwkf.jpg",
                isShow: true,
            },
            ParticipantRequest: {
                createdBy: "67e41f7aa1bf048e97ce585c",
                tour: "67e3d01c78c90ac3d9de8080",
                person: [
                    {
                        name: "Haqqi Sukmara Ishfahani",
                        type: "adult",
                    },
                    {
                        name: "Haqqi Sukmara Ishfahani",
                        type: "child",
                    },
                ],
                totalPerson: 2,
            },
            OrderRequest: {
                tour: "67e3d01c78c90ac3d9de8080",
                participant: "67e519d747467bf388e6b55a",
            },
        },
    },
};

// Gunakan path absolut
// const outputFile = path.join(process.cwd(), "swagger_output.json");
// const endpointsFiles = [path.join(process.cwd(), "src/routes/api.ts")];

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
