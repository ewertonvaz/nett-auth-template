"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basic_authentication_middleware_1 = __importDefault(require("../middlewares/basic.authentication.middleware"));
const forbidden_error_model_1 = __importDefault(require("../models/errors/forbidden.error.model"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pagesRoute = (0, express_1.Router)();
pagesRoute.post(`/login`, basic_authentication_middleware_1.default, (req, res, next) => {
    try {
        const user = req.user;
        const key = !process.env.JWT_SECRET_KEY ? '' : process.env.JWT_SECRET_KEY;
        if (!user) {
            throw new forbidden_error_model_1.default('Usuário não autenticado!', Error);
        }
        const jwtPayload = {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin
        };
        const jwtOptions = { subject: user.uuid, expiresIn: "1h" };
        const token = jsonwebtoken_1.default.sign(jwtPayload, key, jwtOptions);
        res.status(http_status_codes_1.StatusCodes.OK).send(token);
    }
    catch (error) {
        next(error);
    }
    next();
});
exports.default = pagesRoute;
