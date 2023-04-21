import React from "react";
import { Server } from "../../types";
import axios from "axios";
import date from "date-and-time";
import { msToHMS } from "../../utils/timeFormats";

interface Props {
  servers: Server[];
  setServers: React.Dispatch<React.SetStateAction<Server[]>>;
}

const ServersTable = ({ servers, setServers }: Props) => {
  const handleDelete = async (serverId: number) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/server/delete/${serverId}`
      );

      setServers((prev) => {
        prev = prev.filter((server) => server.id !== serverId);
        return [...prev];
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggle = async (serverId: number) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/toggle/${serverId}`
      );

      setServers((prev) => {
        const index = prev.findIndex((server) => server.id === serverId);
        const updatedServer = {
          ...prev[index],
          is_running: !prev[index].is_running,
        };
        const updatedServers = [...prev];
        updatedServers[index] = updatedServer;
        return updatedServers;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefresh = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/server/refresh`
      );

      console.log(data);

      setServers([...data.servers]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="flex flex-col">
      <div className="flex">
        <div>
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
              <p>
                {server.total_running_time &&
                  msToHMS(server.total_running_time)}
              </p>
              <button
                className="border w-fit"
                onClick={() => handleToggle(server.id)}
              >
                {server.is_running ? "Turn Off" : "Turn On"}
              </button>
              <p>{server.type_name}</p>
              <p>
                {(
                  (server.total_running_time / 60000) *
                  server.price_per_minute
                ).toFixed(2)}
                $
              </p>
              <button className="w-fit" onClick={() => handleDelete(server.id)}>
                X
              </button>
            </div>
          ))}
        </div>
        <button className="border" onClick={handleRefresh}>
          refresh
        </button>
      </div>
    </section>
  );
};

export default ServersTable;
