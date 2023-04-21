import { Router } from "express";
import {
  addServer,
  deleteServer,
  getServers,
  refreshPrices,
  toggleServer,
} from "../controllers/serverController";

const serverRouter = Router();

serverRouter.get("/", getServers);

serverRouter.post("/new", addServer);

serverRouter.post("/toggle/:serverId", toggleServer);

serverRouter.delete("/delete/:serverId", deleteServer);

serverRouter.get("/refresh", refreshPrices);

export default serverRouter;
