import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

// get all pastebins
app.get("/pastes", async (req, res) => {
  const dbres = await client.query(
    "select * from pastebin order by creation_date desc LIMIT 10"
  );
  res.status(200).json({
    status: "success",
    data: dbres.rows,
  });
});

// post new pastebin
app.post("/pastes", async (req, res) => {
  const { input, title } = req.body;
  if (
    (typeof input === "string" || typeof input === "number") &&
    (typeof title === "string" ||
      typeof title === "number" ||
      typeof title === undefined)
  ) {
    const dbres = await client.query(
      `insert into pastebin (title, input) values($1, $2) returning *`,
      [title, input]
    );

    res.status(201).json({
      status: "success",
      data: dbres.rows,
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "input expects string or number value",
    });
  }
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
