"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const pages_router_1 = __importDefault(require("./routes/pages.router"));
const authorization_route_1 = __importDefault(require("./routes/authorization.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
console.log(dotenv_1.default.config());
(async () => {
    await (0, typeorm_1.createConnection)();
    const app = (0, express_1.default)();
    const port = 3000;
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/admin', admin_route_1.default);
    app.use(pages_router_1.default);
    app.use('/users', user_routes_1.default);
    app.use('/token', authorization_route_1.default);
    app.listen(port, () => { console.log(`Server is listen on port ${port}`); });
})();
