import { Request, Response } from "express";
import client from "../models/dbModel";
import { Server } from "../types";

export const getServers = async (req: Request, res: Response) => {
  try {
    const { rows: servers } = await client.query(
      "SELECT * FROM server JOIN server_type ON server.type_id = server_type.type_id"
    );

    const pricedServers = servers.map((server) => refreshServerPrice(server));

    res.status(200).json({ servers: pricedServers });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const getServerTypes = async (req: Request, res: Response) => {
  try {
    const { rows: serverTypes } = await client.query(
      "SELECT * FROM server_type"
    );
    res.status(200).json({ serverTypes });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const addServer = async (req: Request, res: Response) => {
  try {
    const { serverName, serverIp, serverTypeId } = req.body;

    console.log(serverName, serverIp, serverTypeId);

    const { rows: newServer } = await client.query(
      `INSERT INTO server (name, ip, type_id, is_running ) values ($1, $2, $3, FALSE) RETURNING *`,
      [serverName, serverIp, serverTypeId]
    );

    const { rows: formatedServer } = await client.query(
      `SELECT * FROM server JOIN server_type ON server.type_id = server_type.type_id WHERE id = $1`,
      [newServer[0].id]
    );

    res.status(200).json({ server: formatedServer[0] });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteServer = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const { rows: servers } = await client.query(
      "DELETE FROM server WHERE id = $1 RETURNING *",
      [serverId]
    );
    res.status(200).json({ servers });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const toggleServer = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const { rows } = await client.query("SELECT * FROM server WHERE id = $1", [
      serverId,
    ]);

    const server = rows[0];

    const updatesServer = server.is_running
      ? await stopServer(server)
      : await startServer(server);

    res.status(200).json({ server: updatesServer });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const getPrices = async (req: Request, res: Response) => {
  try {
    const { rows: servers } = await client.query(
      "SELECT * FROM server JOIN server_type ON server.type_id = server_type.type_id"
    );

    const pricedServers = servers.map((server) => refreshServerPrice(server));

    res.status(200).json({ servers: pricedServers });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const refreshServerPrice = (server: Server) => {
  const updatedServer = {
    ...server,
    total_running_time: calculateTotalRunningTime(server),
  };

  const pricedServers = {
    ...updatedServer,
    price: calculatePrice(updatedServer),
  };

  return pricedServers;
};

const calculateTotalRunningTime = (server: Server) => {
  if (!server.is_running) return server.total_running_time;

  const end_time = new Date().getTime();
  const start_time = new Date(server.start_time).getTime();

  const running_time = end_time - start_time;

  return server.total_running_time + running_time;
};

const calculatePrice = (server: Server) => {
  const price = (
    (server.price_per_minute * server.total_running_time) /
    60000
  ).toFixed(2);

  return price;
};

const startServer = async (server: Server) => {
  const { rows } = await client.query(
    "UPDATE server SET is_running = TRUE, start_time = $1 where id = $2 RETURNING *",
    [new Date(), server.id]
  );
  return rows[0];
};

const stopServer = async (server: Server) => {
  server.total_running_time = calculateTotalRunningTime(server);

  const { rows } = await client.query(
    "UPDATE server SET is_running = FALSE, total_running_time = $1  where id = $2 RETURNING *",
    [server.total_running_time, server.id]
  );

  return refreshServerPrice(rows[0]);
};
