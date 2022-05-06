import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const conf = process.env.NODE_ENV === 'development' ? require('../config/settings_dev').default : require('../config/settings_prod').default;

const jwtAuthenticator = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        const key =  conf.SECRET_KEY;
        if (!authorizationHeader) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Credenciais não informadas!', Error);
        }
        const [type, token ] = authorizationHeader.split(' ');
        if( type !== 'Bearer' || !token) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Tipo de autenticação inválido!', Error);
        }
        if( !token) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Token inválido!', Error);
        }
        
        try {
            const tokenPayload = JWT.verify(token, key);
            if(typeof tokenPayload !== 'object' || !tokenPayload.sub) {
                res.sendStatus(StatusCodes.UNAUTHORIZED);
                throw new ForbiddenError('Token inválido!', Error);
            }
            const user = {
              uuid: tokenPayload.sub,
              name: tokenPayload.name,
              email: tokenPayload.email
            };
            req.user = user;
            next();
        } catch (error) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Token inválido!', Error);
        }
    } catch (error) {
        next(error);
    }
}

export default jwtAuthenticator;