"use strict";

import clear from "rollup-plugin-clear";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";
import { terser } from "rollup-plugin-terser";

let cfg;
const dest = process.env.DEST;
if (!dest) {
    console.log("No destination specified - code will be compiled but not uploaded");
} else if ((cfg = require("./screeps.json")[dest]) == null) {
    throw new Error("Invalid upload destination");
}

const preamble =
    "/**\n" +
    "  * uos v0.0.0\n" +
    "  * (c) 2020-present Cookies\n" +
    "  * @license GPL-3.0\n" +
    "  */";

export default {
    input: "src/main.ts",
    output: [
        {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: true
        },
        {
            file: "dist/main.min.js",
            format: "cjs",
            plugins: [
                terser({
                    ecma: 2016,
                    format: {
                        preamble
                    }
                }),
            ],
            sourcemap: true
        }
    ],


    plugins: [
        clear({ targets: ["dist"] }),
        resolve(),
        commonjs(),
        typescript({ tsconfig: "./tsconfig.json" }),
        screeps({ config: cfg, dryRun: cfg == null })
    ]
};
