const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const favicon = require("serve-favicon");
const connectPgSession = require("connect-pg-simple")(session);
const { Strategy } = require("passport-local");
const { join } = require("path");
const { config } = require("dotenv");
const authRouter = require("./routers/authRouter");
const homeRouter = require("./routers/homeRouter");
const postRouter = require("./routers/postRouter");
const { poolInstance } = require("./db/dbClient");

config();

const app = express();
const pgPool = poolInstance.getPool();

app.use(express.static(join(__dirname, "public")));
app.use(favicon(join(__dirname, "public", "favicon.ico")));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.listen(3000, () => {
  console.log("Listening at: http://localhost:3000");
});
