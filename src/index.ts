import { app } from "./app";
import { createConnection } from "typeorm";
import "reflect-metadata";
const start = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 3306,
      username: "test",
      password: "test",
      database: "test",
    });
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log("Auth-Service is running on port:" + 4000);
  });
};

start();
