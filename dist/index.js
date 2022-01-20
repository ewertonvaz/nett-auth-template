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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const pages_routes_1 = __importDefault(require("./routes/pages.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const authorization_routes_1 = __importDefault(require("./routes/authorization.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const auth_connect_1 = require("./shared/orm/auth.connect");
const appdata_connect_1 = require("./shared/orm/appdata.connect");
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, typeorm_1.createConnections)([
        auth_connect_1.auth,
        appdata_connect_1.appdata
    ]);
    const app = (0, express_1.default)();
    const port = 3000;
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/admin', admin_routes_1.default);
    app.use('/user', user_routes_1.default);
    app.use('/token', authorization_routes_1.default);
    app.use('/event', event_routes_1.default);
    app.use(pages_routes_1.default);
    app.listen(port, () => { console.log(`Server is listen on port ${port}`); });
}))();
