import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRepository from '../repositories/user.mysql.repository';
//import userRepository from '../repositories/user.postgres.repository';
import jwtAuthenticator from '../middlewares/jwt.authentication.middleware';
import JWT from 'jsonwebtoken';
import conf from '../config/settings';

const usersRoute = Router();

usersRoute.get(`/`, jwtAuthenticator, async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.user;
    const user = await userRepository.findByUUID( uuid );
    var errorsToSend = []

    if ( !user ) {
        errorsToSend.push('Usuário não encontrado!')
        res.status(StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    if ( !user.is_admin ) {
        errorsToSend.push('Somente Administradores possuem acesso a este recurso!')
        res.status(StatusCodes.FORBIDDEN).send({ errors: errorsToSend });
        return;
    }
    const usersList = await userRepository.listUsers();
    if (!!usersList) {
        res.status(StatusCodes.OK).json( usersList );
    } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    next();
});

usersRoute.post(`/login`, async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { email, password } =  req.body;
        const key =  conf.SECRET_KEY;

        if (!email || !password) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        const user = await userRepository.loginUser(email, password);
        if (!user) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        const jwtPayload = {
            uuid: user ? user.uuid : '',
            name: user ? user.name : '',
            email: user ? user.email : ''
        };
        const tokenExpire = user.is_admin ? conf.ADM_TOKEN_EXPIRES : conf.USER_TOKEN_EXPIRES;
        const jwtOptions = { subject: jwtPayload.uuid, expiresIn: tokenExpire };
        const token = JWT.sign( jwtPayload, key, jwtOptions);
        const userData = { ...jwtPayload, token }
        if ( !!userData ) {
            res.json( userData );
        } else {
            res.sendStatus(StatusCodes.FORBIDDEN);
        }
    } catch (err) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
        next(err);
    }
    next();
});

usersRoute.post('/create', jwtAuthenticator, async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    var errorsToSend = []

    if ( !userData.name || !userData.email || !userData.password ) {
        errorsToSend.push('Nome, e-mail ou senha inválidos!')
        res.status(StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const newUser = await userRepository.createUser(userData);
    if (!newUser) {
        errorsToSend.push('Não foi possível criar o usuário!')
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: errorsToSend });
        return;
    }
    if ( !!newUser ) {
        res.status(StatusCodes.CREATED).json({
          uuid: newUser.uuid,
          name: newUser.name,
          email: newUser.email,
          user_token: newUser.user_token,
          email_validated : newUser.email_validated,
          is_admin: newUser.is_admin
        });
    } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

usersRoute.put('/update', jwtAuthenticator, async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    var errorsToSend = []

    if ( !userData.name || !userData.email || !userData.uuid ) {
        errorsToSend.push('Nome ou e-mail inválidos!')
        res.status(StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const user = await userRepository.updateUser(userData);
    if (!user) {
        errorsToSend.push('Não foi possível atualizar o usuário!')
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: errorsToSend });
        return;
    }
    if ( !!user ) {
        res.status(StatusCodes.OK).json({
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          user_token: user.user_token,
          email_validated : user.email_validated,
          is_admin: user.is_admin
        });
    } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

usersRoute.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const key =  conf.SECRET_KEY;
    var errorsToSend = []

    if ( !userData.name || !userData.email || !userData.password ) {
        errorsToSend.push('Nome, e-mail ou senha inválidos!')
        res.status(StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const newUser = await userRepository.createUser({...userData, is_admin : false});
    if (!newUser) {
        errorsToSend.push('Não foi possível criar o usuário!')
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: errorsToSend });
        return;
    }
    const jwtPayload = {
      uuid: newUser ? newUser.uuid : '',
      name: newUser ? newUser.name : '',
      email: newUser ? newUser.email : ''
    };
    const jwtOptions = { subject: jwtPayload.uuid, expiresIn: conf.USER_TOKEN_EXPIRES };
    const token = JWT.sign( jwtPayload, key, jwtOptions);
    const userResult = { ...jwtPayload, token }
    if ( !!userResult ) {
        res.status(StatusCodes.CREATED).json( userResult );
    } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

usersRoute.put('/delete', jwtAuthenticator, async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.body;
    const user =  await userRepository.findByUUID( uuid );
    var errorsToSend = []

    if (!user) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }
    try {
       const result = await userRepository.deleteUser(user);
       if ( !result || result < 1 ) {
            errorsToSend.push('Usuário não encontrado!');
            res.status(StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
            return;
       } else {
            res.status(StatusCodes.OK).send({ 
              user: {
                uuid: user.uuid,
                name: user.name,
                email: user.email
              }
            });
       }
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
});

usersRoute.put('/changepasswd', jwtAuthenticator, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { actual, newpasswd } = req.body;
    var errorsToSend = []
    if (!user) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }

    const actualUser = await userRepository.findByUUID( user.uuid );
    if (!actualUser) {
        errorsToSend.push('Usuário não encontrado!');
        res.status(StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
        return;
    }

    if ( user.name !== actualUser.name || user.email !== actualUser.email ) {
        errorsToSend.push('Nome, e-mail ou senha inválidos!')
        res.status(StatusCodes.BAD_REQUEST).send({ errors: errorsToSend });
        return;
    }
    const result = await userRepository.updatePassword(actualUser, actual, newpasswd);
    if ( result ) {
        res.status(StatusCodes.OK).json( result );
    } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export default usersRoute;