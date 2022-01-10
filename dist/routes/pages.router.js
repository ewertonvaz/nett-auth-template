"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basic_authentication_middleware_1 = __importDefault(require("../middlewares/basic.authentication.middleware"));
const pagesRoute = (0, express_1.Router)();
const baseUrl = '/pages';
pagesRoute.get(`${baseUrl}/main`, basic_authentication_middleware_1.default, (req, res, next) => {
    const user = JSON.stringify(req.body);
    res.send(user);
    next();
});
exports.default = pagesRoute;
