import { Router } from "express";
import { getServers } from "../controllers/serverController";

const serverRouter = Router();

serverRouter.get("/", getServers);

export default serverRouter;
