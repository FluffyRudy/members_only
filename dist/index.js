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
const express_session_1 = __importDefault(require("express-session"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const passport_local_1 = require("passport-local");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const homeRouter_1 = __importDefault(require("./routers/homeRouter"));
const postRouter_1 = __importDefault(require("./routers/postRouter"));
const dbClient_1 = require("./db/dbClient");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
const pgPool = dbClient_1.poolInstance.getPool();
app.use(express_1.default.static((0, path_1.join)(process.cwd(), "public")));
app.use((0, serve_favicon_1.default)((0, path_1.join)(process.cwd(), "public", "favicon.ico")));
app.set("views", (0, path_1.join)(process.cwd(), "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pgPool,
        tableName: 'session',
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: process.env.NODE_ENV === "prod",
        secure: process.env.NODE_ENV === 'prod',
    }
}));
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pgPool.query("SELECT * FROM users WHERE username=$1", [username]);
        const user = rows[0];
        if (!user)
            return done(null, false, { message: "User doesnt exist" });
        const passwordCmp = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordCmp)
            return done(null, false, { message: 'Wrong password' });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
passport_1.default.serializeUser((user, done) => {
    const userId = user === null || user === void 0 ? void 0 : user.id;
    if (!userId)
        return done("Missing user id");
    done(null, userId);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield pgPool.query("SELECT * FROM users WHERE id=$1", [id]);
        const user = rows[0];
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
app.use("/auth", authRouter_1.default);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use("/", homeRouter_1.default);
app.use("/post", postRouter_1.default);
app.use((err, req, res, next) => {
    res.status(500).render("error", { errorMessage: (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong" });
});
app.listen(3000, () => {
    console.log("Listening at: http://localhost:3000");
});
