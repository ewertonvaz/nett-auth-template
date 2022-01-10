"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forbidden_error_model_1 = __importDefault(require("../models/errors/forbidden.error.model"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const basicAuthenticator = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            throw new forbidden_error_model_1.default('Credenciais não informadas!', Error);
        }
        const [type, auth] = authorizationHeader.split(' ');
        if (type !== 'Basic' || !auth) {
            throw new forbidden_error_model_1.default('Tipo de autenticação inválido!', Error);
        }
        const [user, passwd] = Buffer.from(auth, 'base64').toString('utf-8').split(':');
        if (!user || !passwd) {
            throw new forbidden_error_model_1.default('Credenciais inválidas e/ou vazias!', Error);
        }
        const data = await user_repository_1.default.findByNameAndPassword(user, passwd);
        const autheticatedUser = data;
        if (!autheticatedUser) {
            throw new forbidden_error_model_1.default('Usuário não autenticado!', Error);
        }
        req.user = autheticatedUser;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = basicAuthenticator;
