"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const params = {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'authdb'
};
exports.mysqlDB = promise_1.default.createPool(params);
