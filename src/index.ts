import { app } from "./app";
import { createConnection } from "typeorm";
import "reflect-metadata";
import { OTP } from "./entities/Otp";
import { User } from "./entities/User";

const start = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "test",
      password: "test",
      database: "test",
      entities: [OTP, User],
      synchronize: true,
    });
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log("Auth-Service is running on port:" + 4000);
  });
};

start();
