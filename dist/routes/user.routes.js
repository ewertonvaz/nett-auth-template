"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const jwt_authentication_middleware_1 = __importDefault(require("../middlewares/jwt.authentication.middleware"));
const usersRoute = (0, express_1.Router)();
usersRoute.post(`/login`, async (req, res, next) => {
    try {
        const { user, password } = req.body;
        if (!user || !password) {
            res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
            return;
        }
        const data = await user_repository_1.default.loginUser(user, password);
        const userData = data;
        if (!!userData) {
            res.json({ ...userData, password: null });
        }
        else {
            res.sendStatus(http_status_codes_1.StatusCodes.FORBIDDEN);
        }
    }
    catch (err) {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        next(err);
    }
    next();
});
usersRoute.post(`/`, jwt_authentication_middleware_1.default, async (req, res, next) => {
    const userData = req.body;
    if (!userData) {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        return;
    }
    const user = await user_repository_1.default.createUser(userData);
    if (!!user) {
        res.send({ ...user, password: null });
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
    next();
});
usersRoute.post('/create', jwt_authentication_middleware_1.default, async (req, res, next) => {
});
exports.default = usersRoute;
