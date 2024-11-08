import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import tailwindConfig from "./tailwind.config.js";

export default {
    plugins: [
        tailwind(tailwindConfig),
        autoprefixer,
    ],
};


// const autoprefixer = require("autoprefixer");
// const tailwindcss = require("tailwindcss");
// const tailwindConfig = require("./tailwind.config.js");
//
// module.exports = {
//     plugins: [
//         tailwindcss(tailwindConfig),
//         autoprefixer,
//     ],
// };