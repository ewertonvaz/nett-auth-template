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
const forbidden_error_model_1 = __importDefault(require("../models/errors/forbidden.error.model"));
const user_mysql_repository_1 = __importDefault(require("../repositories/user.mysql.repository"));
const http_status_codes_1 = require("http-status-codes");
const basicAuthenticator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Credenciais não informadas!', Error);
        }
        const [type, auth] = authorizationHeader.split(' ');
        if (type !== 'Basic' || !auth) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Tipo de autenticação inválido!', Error);
        }
        const [email, passwd] = Buffer.from(auth, 'base64').toString('utf-8').split(':');
        if (!email || !passwd) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Credenciais inválidas e/ou vazias!', Error);
        }
        const data = yield user_mysql_repository_1.default.findByEmailAndPassword(email, passwd);
        const autheticatedUser = data;
        if (!autheticatedUser) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Usuário não autenticado!', Error);
        }
        req.user = autheticatedUser;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = basicAuthenticator;
