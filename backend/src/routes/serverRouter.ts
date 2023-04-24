import { Router } from "express";
import {
  addServer,
  deleteServer,
  getServers,
  getPrices,
  toggleServer,
  getServerTypes,
} from "../controllers/serverController";

const serverRouter = Router();

serverRouter.get("/servers", getServers);

serverRouter.get("/server-types", getServerTypes);

serverRouter.get("/refresh", getPrices);

serverRouter.post("/new", addServer);

serverRouter.post("/toggle/:serverId", toggleServer);

serverRouter.delete("/delete/:serverId", deleteServer);

export default serverRouter;
