"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forbidden_error_model_1 = __importDefault(require("../models/errors/forbidden.error.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtAuthenticator = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        const key = !process.env.JWT_SECRET_KEY ? '' : process.env.JWT_SECRET_KEY;
        if (!authorizationHeader) {
            throw new forbidden_error_model_1.default('Credenciais não informadas!', Error);
        }
        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new forbidden_error_model_1.default('Tipo de autenticação inválido!', Error);
        }
        if (!token) {
            throw new forbidden_error_model_1.default('Token inválido!', Error);
        }
        try {
            const tokenPayload = jsonwebtoken_1.default.verify(token, key);
            if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
                throw new forbidden_error_model_1.default('Token inválido!', Error);
            }
            const user = {
                uuid: tokenPayload.sub,
                user: tokenPayload.user
            };
            req.user = user;
            next();
        }
        catch (error) {
            throw new forbidden_error_model_1.default('Token inválido!', Error);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = jwtAuthenticator;
