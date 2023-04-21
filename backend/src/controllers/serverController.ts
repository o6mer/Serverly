import { Request, Response } from "express";
import client from "../models/dbModel";

export const getServers = async (req: Request, res: Response) => {
  try {
    const { rows: servers } = await client.query(
      "SELECT * FROM server JOIN serverType ON server.typeId = serverType.id"
    );
    const { rows: serverTypes } = await client.query(
      "SELECT * FROM servertype"
    );
    res.status(200).json({ servers, serverTypes });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
