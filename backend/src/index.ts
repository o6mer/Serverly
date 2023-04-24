import express from "express";
import dotenv from "dotenv";
import serverRouter from "./routes/serverRouter";
import cors from "cors";
import utilRouter from "./routes/utilRouter";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/api/server", serverRouter);
app.use("/api/util", utilRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
