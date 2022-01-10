import { Router, Request, Response, NextFunction } from 'express';
import jwtAuthenticator from '../middlewares/jwt.authentication.middleware';
import { Event } from '../entity/appdata/event.entity';
import { StatusCodes } from 'http-status-codes';

const eventsRoute = Router();

eventsRoute.get(`/dashboard`, jwtAuthenticator, async (req: Request, res: Response, next : NextFunction) => {
    const user = JSON.stringify(req.user);
    const events = await Event.find();
    res.send(events);
    next();
});

eventsRoute.post(`/create`, jwtAuthenticator, async (req: Request, res: Response, next : NextFunction) => {
    try {
        const eventData = req.body;
        const { title, time, date } = eventData;
        const convertedDate = new Date( date )
        const event = new Event();
        event.title = title;
        event.time = time;
        event.date = convertedDate;
        await event.save();
        res.status(StatusCodes.CREATED).send(event);
    } catch (err) {
        console.log(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
    next();
});

eventsRoute.put(`/delete`, jwtAuthenticator, async (req: Request, res: Response, next : NextFunction) => {
    var errorsToSend = [];
    try {
        const { id } = req.body;
        const event = await Event.findOne({ 'id': id });
        if (event) {
            const result = await event.remove();
            res.status(StatusCodes.OK).send(result);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (err) {
        errorsToSend.push('Não foi possível remover o evento');
        res.status(StatusCodes.NOT_FOUND).send({ errors: errorsToSend });
    }
});

export default eventsRoute;