import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import passport from "passport";
import favicon from "serve-favicon";
import connectPgSession from "connect-pg-simple";
import { Strategy } from "passport-local";
import { join } from "path";
import { config } from "dotenv";
import { User } from "./types/user";
import authRouter from "./routers/authRouter";
import homeRouter from "./routers/homeRouter"
import { poolInstance } from "./db/dbClient"

config();

const app = express();
const pgSession = connectPgSession(session)
const pgPool = poolInstance.getPool()

app.use(express.static(join(__dirname, "public")))
app.use(favicon(join(__dirname, "public", "favicon.ico")))
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_COOKIE_SECRET!,
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
}))
app.use(passport.session())

passport.use(new Strategy(async (username, password, done) => {
    try {
        const { rows } = await pgPool.query("SELECT * FROM users WHERE username=$1", [username]);
        const user: User | null = rows[0];

        if (!user)
            return done(null, false, { message: "User doesnt exist" });

        const passwordCmp = await bcrypt.compare(password, user.password)
        if (!passwordCmp)
            return done(null, false, { message: 'Wrong password' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}))

passport.serializeUser((user, done) => {
    const userId = (user as User)?.id;
    if (!userId)
        return done("Missing user id");
    done(null, userId);
})

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pgPool.query("SELECT * FROM users WHERE id=$1", [id]);
        const user = rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
})

app.use("/auth", authRouter);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})
app.use("/", homeRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).render("error", { errorMessage: err?.message || "Something went wrong" });
});

app.listen(3000, () => {
    console.log("Listening at: http://localhost:3000")
})

