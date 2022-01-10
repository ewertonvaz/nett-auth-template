import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.mysql.repository';
import { StatusCodes } from 'http-status-codes';

const basicAuthenticator = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Credenciais não informadas!', Error);
        }
        const [type, auth ] = authorizationHeader.split(' ');
        if( type !== 'Basic' || !auth) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Tipo de autenticação inválido!', Error);
        }
        const [email, passwd] = Buffer.from(auth,'base64').toString('utf-8').split(':');
        if( !email || !passwd) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Credenciais inválidas e/ou vazias!', Error);
        }

        const data = await userRepository.findByEmailAndPassword(email, passwd);
        const autheticatedUser = data;
        if (!autheticatedUser) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            throw new ForbiddenError('Usuário não autenticado!', Error);
        }
        req.user = autheticatedUser;
        next();
    } catch (error) {
        next(error);
    }
}

export default basicAuthenticator;