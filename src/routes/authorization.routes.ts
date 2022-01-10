import { Router, Request, Response, NextFunction } from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import { StatusCodes } from 'http-status-codes';
import JWT from 'jsonwebtoken';
import basicAuthenticator from '../middlewares/basic.authentication.middleware';
import jwtAuthenticator from '../middlewares/jwt.authentication.middleware';
import User from '../models/user.model';
import conf from '../config/settings';

const authorizationRoute = Router ();

authorizationRoute.post('/', basicAuthenticator, async (req : Request, res : Response, next : NextFunction) => {
    try {
        const user : User = req.user;
        const key =  conf.SECRET_KEY;
        if (!user) {
            throw new ForbiddenError('Usuário não autenticado!', Error)
        }
        const jwtPayload = { user: user };
        const jwtOptions = { subject: user.uuid };
        const token = JWT.sign( jwtPayload, key, jwtOptions);
        res.status(StatusCodes.OK).send(token);
    } catch (error) {
        next(error);        
    }
    next();
});

authorizationRoute.post('/validate', jwtAuthenticator, (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default authorizationRoute;