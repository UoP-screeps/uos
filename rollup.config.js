"use strict";

import clear from "rollup-plugin-clear";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";
import { terser } from "rollup-plugin-terser";
import * as config from "./package.json";

const preamble =
    "/**\n" +
    "  * uos v" + config.version + "\n" +
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
        screeps({dryRun: true })
    ]
};
