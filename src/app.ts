import express, { Application, Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError } from "./common/errors/not-found";
import { errorHandler } from "./middlewares/error-handle";
import { authRouter } from "./routes/auth";
import { currentUser } from "./middlewares/current-user";

const app: Application = express();

app.use(json());

app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.get("/", (req, res) => {
  res.send("StudyHox is running 3");
});

app.use("/api/auth", authRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
