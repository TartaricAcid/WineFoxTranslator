import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/main.js",
    output: {
        file: "extension.js",
        format: "cjs"
    },
    plugins: [
        resolve(),
        commonjs(),
        terser({
            mangle: false
        })
    ],
    external: []
};