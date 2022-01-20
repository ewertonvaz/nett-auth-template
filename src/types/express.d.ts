import { User } from '../models/user.model';
import { Event } from '../models/event.model';

declare module 'express-serve-static-core' {

    interface Request {
        user? : User | null,
        event? : Event | null
    }
}