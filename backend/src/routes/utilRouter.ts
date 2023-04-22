import { Router } from "express";
import { getCurrrencies } from "../controllers/utilController";

const utilRouter = Router();

utilRouter.get("/currencies", getCurrrencies);

export default utilRouter;
