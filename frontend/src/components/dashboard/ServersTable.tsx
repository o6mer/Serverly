import React from "react";
import { Server } from "../../types";

interface Props {
  servers: Server[];
}

const ServersTable = ({ servers }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 gap-2 w-full ">
        <p>ip</p>
        <p>name</p>
        <p>time running</p>
        <p>toggle</p>
        <p>type</p>
        <p>price</p>
        <p>delete</p>
      </div>
      {servers.map((server: Server) => (
        <div className="grid grid-cols-7 gap-2 w-full" key={server.name}>
          <p>{server.ip}</p>
          <p>{server.name}</p>
          <p>00:00:00</p>
          <p>{server.isRunning ? "Running" : "Stopped"}</p>
          <p>{server.typeName}</p>
          <p>{server.pricePerMinute}$</p>
          <button className="w-fit">X</button>
        </div>
      ))}
    </div>
  );
};

export default ServersTable;
