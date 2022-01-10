import { Router, Request, Response, NextFunction } from 'express';
import basicAuthenticator from '../middlewares/basic.authentication.middleware';
// import { StatusCodes } from 'http-status-codes';

const pagesRoute = Router();
const baseUrl = '/pages';

pagesRoute.get(`${baseUrl}/main`, basicAuthenticator, (req: Request, res: Response, next : NextFunction) => {
    const user = JSON.stringify(req.body);
    res.send(user);
    next();
});

export default pagesRoute;