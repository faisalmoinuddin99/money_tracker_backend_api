require("dotenv").config();
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./models/User";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Season } from "./models/Season";
import { Episode } from "./models/Episode";
import { insertSeasons } from "./routes/season";
import { insertEpisodes } from "./routes/episode";
import { fetchEpisodeRouter } from "./routes/fetch_episodes";
import { signinRoute, signupRoute } from "./routes/auth";

const app = express();
const port = process.env.PORT || 5000;

const db_mysql: any = process.env.DB_TYPE;
const db_host: any = process.env.DB_HOST;
const db_username: any = process.env.DB_USERNAME;
const db_port: any = process.env.DB_PORT;
const converted_dbPort = Number(db_port);
const db_password: any = process.env.DB_password;
const db_database: any = process.env.DB_DATABASE;

const main = async () => {
  try {
    await createConnection({
      type: db_mysql,
      host: db_host,
      username: db_username,
      port: converted_dbPort,
      password: db_password,
      database: db_database,
      entities: [User, Season, Episode],
      synchronize: true,
    });
    console.log("connected to mysql database successfully...");

    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(signupRoute);
    app.use(signinRoute);
    app.use(insertSeasons);
    app.use(insertEpisodes);
    app.use(fetchEpisodeRouter);

    app.listen(port, () => {
      console.log(`server is running at ${port} port...`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    throw new Error("Unable to connect DB...");
  }
};

main();
