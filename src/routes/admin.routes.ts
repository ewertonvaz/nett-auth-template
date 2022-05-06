import { Router, Request, Response, NextFunction } from 'express';
import basicAuthenticator from '../middlewares/basic.authentication.middleware';
import ForbiddenError from '../models/errors/forbidden.error.model';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';
import jwtAuthenticator from '../middlewares/jwt.authentication.middleware';
import User from '../models/user.model';

const conf = process.env.NODE_ENV === 'development' ? require('../config/settings_dev').default : require('../config/settings_prod').default;
const pagesRoute = Router();

pagesRoute.post(`/login`, basicAuthenticator, (req: Request, res: Response, next : NextFunction) => {
    try {
        const user : User = req.user;
        const key =  conf.SECRET_KEY;
        if (!user) {
            throw new ForbiddenError('Usuário não autenticado!', Error)
        }
        const jwtPayload = { 
          uuid: user.uuid,
          name: user.name,
          email: user.email
        };
        const jwtOptions = { subject: user.uuid, expiresIn: "1h" };
        const token = JWT.sign( jwtPayload, key, jwtOptions);
        res.status(StatusCodes.OK).send(token);
    } catch (error) {
        next(error);        
    }
    next();
});

export default pagesRoute;