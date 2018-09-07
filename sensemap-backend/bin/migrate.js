require('dotenv').config();
tsconfig = require("../tsconfig.json");
require("ts-node").register(tsconfig);
require("../node_modules/.bin/node-pg-migrate");
