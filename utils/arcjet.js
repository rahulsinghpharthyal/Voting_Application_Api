// import dotenv from "dotenv";
// dotenv.config();
// import arcjet, { validateEmail } from '@arcjet/node';

// console.log('this is arcjet', process.env.ARCJET_KEY)
// console.log('this is arcjet', process.env.JWT_REFRESH_TOKEN)

// const aj = arcjet({
//     key: process.env.ARCJET_KEY,
//     rules: [
//         validateEmail({
//             mode: "LIVE",
//             // block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
//         }),
//     ],
// });

// export default aj;


import arcjet from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
});

console.log("Arcjet initialized:", aj);
export default aj;