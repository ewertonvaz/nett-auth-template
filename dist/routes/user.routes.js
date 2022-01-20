"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const user_mysql_repository_1 = __importDefault(require("../repositories/user.mysql.repository"));
const jwt_authentication_middleware_1 = __importDefault(require("../middlewares/jwt.authentication.middleware"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = __importDefault(require("../config/settings"));
const usersRoute = (0, express_1.Router)();
usersRoute.get(`/`, jwt_authentication_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.user;
    const user = yield user_mysql_repository_1.default.findByUUID(uuid);
    var errorsToSend = [];
    if (!user) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    if (!user.is_admin) {
        errorsToSend.push('Somente Administradores possuem acesso a este recurso!');
        res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({ errors: errorsToSend });
        return;
    }
    const usersList = yield user_mysql_repository_1.default.listUsers();
    if (!!usersList) {
        res.status(http_status_codes_1.StatusCodes.OK).json(usersList);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
    next();
}));
usersRoute.post(`/login`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const key = settings_1.default.SECRET_KEY;
        if (!email || !password) {
            res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
            return;
        }
        const user = yield user_mysql_repository_1.default.loginUser(email, password);
        if (!user) {
            res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
            return;
        }
        const jwtPayload = {
            uuid: user ? user.uuid : '',
            name: user ? user.name : '',
            email: user ? user.email : ''
        };
        const tokenExpire = user.is_admin ? settings_1.default.ADM_TOKEN_EXPIRES : settings_1.default.USER_TOKEN_EXPIRES;
        const jwtOptions = { subject: jwtPayload.uuid, expiresIn: tokenExpire };
        const token = jsonwebtoken_1.default.sign(jwtPayload, key, jwtOptions);
        const userData = Object.assign(Object.assign({}, jwtPayload), { token });
        if (!!userData) {
            res.json(userData);
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
}));
usersRoute.post('/create', jwt_authentication_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.user;
    const user = yield user_mysql_repository_1.default.findByUUID(uuid);
    const userData = req.body;
    var errorsToSend = [];
    if (!user) {
        errorsToSend.push('Usuário não autenticado ou não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    if (!user.is_admin) {
        errorsToSend.push('Somente Administradores possuem acesso a este recurso!');
        res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({ errors: errorsToSend });
        return;
    }
    if (!userData.name || !userData.email || !userData.password) {
        errorsToSend.push('Nome, e-mail ou senha inválidos!');
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const newUser = yield user_mysql_repository_1.default.createUser(userData);
    if (!newUser) {
        errorsToSend.push('Não foi possível criar o usuário!');
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: errorsToSend });
        return;
    }
    if (!!newUser) {
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            uuid: newUser.uuid,
            name: newUser.name,
            email: newUser.email,
            user_token: newUser.user_token,
            email_validated: newUser.email_validated,
            is_admin: newUser.is_admin
        });
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
usersRoute.put('/update', jwt_authentication_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.user;
    const user = yield user_mysql_repository_1.default.findByUUID(uuid);
    const userData = req.body;
    var errorsToSend = [];
    if (!user) {
        errorsToSend.push('Usuário não autenticado ou não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    if (!user.is_admin) {
        errorsToSend.push('Somente Administradores possuem acesso a este recurso!');
        res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({ errors: errorsToSend });
        return;
    }
    if (!userData.name || !userData.email || !userData.uuid) {
        errorsToSend.push('Nome ou e-mail inválidos!');
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const updateUser = yield user_mysql_repository_1.default.updateUser(userData);
    if (!updateUser) {
        errorsToSend.push('Não foi possível atualizar o usuário!');
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: errorsToSend });
        return;
    }
    if (!!updateUser) {
        res.status(http_status_codes_1.StatusCodes.OK).json({
            uuid: updateUser.uuid,
            name: updateUser.name,
            email: updateUser.email,
            user_token: updateUser.user_token,
            email_validated: updateUser.email_validated,
            is_admin: updateUser.is_admin
        });
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
usersRoute.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const key = settings_1.default.SECRET_KEY;
    var errorsToSend = [];
    if (!userData.name || !userData.email || !userData.password) {
        errorsToSend.push('Nome, e-mail ou senha inválidos!');
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const newUser = yield user_mysql_repository_1.default.createUser(Object.assign(Object.assign({}, userData), { is_admin: false }));
    if (!newUser) {
        errorsToSend.push('Não foi possível criar o usuário!');
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: errorsToSend });
        return;
    }
    const jwtPayload = {
        uuid: newUser ? newUser.uuid : '',
        name: newUser ? newUser.name : '',
        email: newUser ? newUser.email : ''
    };
    const jwtOptions = { subject: jwtPayload.uuid, expiresIn: settings_1.default.USER_TOKEN_EXPIRES };
    const token = jsonwebtoken_1.default.sign(jwtPayload, key, jwtOptions);
    const userResult = Object.assign(Object.assign({}, jwtPayload), { token });
    if (!!userResult) {
        res.status(http_status_codes_1.StatusCodes.CREATED).json(userResult);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
usersRoute.delete('/delete', jwt_authentication_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.user;
    const user = yield user_mysql_repository_1.default.findByUUID(uuid);
    var errorsToSend = [];
    if (!user) {
        errorsToSend.push('Usuário não autenticado ou não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    if (!user.is_admin) {
        errorsToSend.push('Somente Administradores possuem acesso a este recurso!');
        res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({ errors: errorsToSend });
        return;
    }
    const deletedUuid = req.body.uuid;
    const deletedUser = yield user_mysql_repository_1.default.findByUUID(deletedUuid);
    if (!deletedUser) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    try {
        const result = yield user_mysql_repository_1.default.deleteUser(deletedUser);
        if (!result || result < 1) {
            errorsToSend.push('Usuário não encontrado!');
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
            return;
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).send({
                user: {
                    uuid: deletedUser.uuid,
                    name: deletedUser.name,
                    email: deletedUser.email
                }
            });
        }
    }
    catch (err) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
}));
usersRoute.put('/changepasswd', jwt_authentication_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { actual, newpasswd } = req.body;
    var errorsToSend = [];
    if (!user) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    const actualUser = yield user_mysql_repository_1.default.findByUUID(user.uuid);
    if (!actualUser) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    if (user.name !== actualUser.name || user.email !== actualUser.email) {
        errorsToSend.push('Nome, e-mail ou senha inválidos!');
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const result = yield user_mysql_repository_1.default.updatePassword(actualUser, actual, newpasswd);
    if (result) {
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}));
exports.default = usersRoute;
