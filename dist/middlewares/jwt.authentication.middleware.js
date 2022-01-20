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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const settings_1 = __importDefault(require("../config/settings"));
const jwtAuthenticator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers['authorization'];
        const key = settings_1.default.SECRET_KEY;
        if (!authorizationHeader) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Credenciais não informadas!', Error);
        }
        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Tipo de autenticação inválido!', Error);
        }
        if (!token) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Token inválido!', Error);
        }
        try {
            const tokenPayload = jsonwebtoken_1.default.verify(token, key);
            if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
                res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
                throw new forbidden_error_model_1.default('Token inválido!', Error);
            }
            const user = {
                uuid: tokenPayload.sub,
                name: tokenPayload.name,
                email: tokenPayload.email
            };
            req.user = user;
            next();
        }
        catch (error) {
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            throw new forbidden_error_model_1.default('Token inválido!', Error);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = jwtAuthenticator;
