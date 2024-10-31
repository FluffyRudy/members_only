const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const favicon = require("serve-favicon");
const connectPgSession = require("connect-pg-simple")(session);
const { Strategy } = require("passport-local");
const { join } = require("path");
const { config } = require("dotenv");
const authRouter = require("./routers/authRouter.cjs");
const homeRouter = require("./routers/homeRouter.cjs");
const postRouter = require("./routers/postRouter.cjs");
const { poolInstance } = require("./db/dbClient.cjs");

config();

const app = express();
const pgPool = poolInstance.getPool();

app.use(express.static(join(__dirname, "public")));
app.use(favicon(join(__dirname, "public", "favicon.ico")));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new connectPgSession({
      pool: pgPool,
      tableName: "session",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: process.env.NODE_ENV === "prod",
      secure: process.env.NODE_ENV === "prod",
    },
  })
);
app.use(passport.session());

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const { rows } = await pgPool.query(
        "SELECT * FROM users WHERE username=$1",
        [username]
      );
      const user = rows[0];

      if (!user) return done(null, false, { message: "User doesnt exist" });

      const passwordCmp = await bcrypt.compare(password, user.password);
      if (!passwordCmp) return done(null, false, { message: "Wrong password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  const userId = user?.id;
  if (!userId) return done("Missing user id");
  done(null, userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pgPool.query("SELECT * FROM users WHERE id=$1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/auth", authRouter);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use("/", homeRouter);
app.use("/post", postRouter);

app.use((err, req, res, next) => {
  res
    .status(500)
    .render("error", { errorMessage: err?.message || "Something went wrong" });
});

const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Listening at: http://localhost:${PORT}`);
});
