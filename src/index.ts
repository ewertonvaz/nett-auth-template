import express from 'express';
import cors from 'cors';
import usersRoute from './routes/user.routes';
import pagesRoute from './routes/pages.routes';
import eventsRoute from './routes/event.routes';
import authorizationRoute from './routes/authorization.routes';
import adminRoute from './routes/admin.routes';
import "reflect-metadata";
import { ConnectionOptions, createConnections } from "typeorm";
// import './ormconfig.json';
import { auth } from './shared/orm/auth.connect';
import { appdata } from './shared/orm/appdata.connect';

(async() => {
    await createConnections([ 
      auth as ConnectionOptions,
      appdata as ConnectionOptions
    ]);

    const app = express();
    const port = 3000;
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use('/admin', adminRoute);
    app.use('/user', usersRoute);
    app.use('/token', authorizationRoute);
    app.use('/event', eventsRoute);
    app.use(pagesRoute);

    app.listen(port, () => { console.log(`Server is listen on port ${port}`)});
})();