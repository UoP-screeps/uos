// use test configuration for tsconfig
process.env.TS_NODE_PROJECT = "tsconfig.test.json";

// inject mocha globally to allow custom interface refer without direct import - bypass bundle issue
global._ = require("lodash");
global.mocha = require("mocha");
global.chai = require("chai");
global.sinon = require("sinon");
global.chai.use(require("sinon-chai"));
// initialize game and memory
global.Memory = {};
global.Game = {};
Object.assign(global, require("@screeps/common/lib/constants"));
