import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.POSTGRES_HOST);

const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
  if (err) return console.log(err);
  console.log("connected to db");
});

export default client;
