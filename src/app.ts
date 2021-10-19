import express, { Application, Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { NotFoundError } from "./common/errors/not-found";
import { errorHandler } from "./common/errors/error-handle";

const app: Application = express();

app.use(json());

app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.get("/", (req, res) => {
  res.send("StudyHox is running 2");
});

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
