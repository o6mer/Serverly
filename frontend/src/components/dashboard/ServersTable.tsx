import React, { useEffect, useState } from "react";
import { Server } from "../../types";
import axios from "axios";
import { msToHMS } from "../../utils/timeFormats";
import Loader from "../general/Loader";

interface Props {
  servers: Server[];
  setServers: React.Dispatch<React.SetStateAction<Server[]>>;
  currencies: {
    [key: string]: number;
  };
}

const ServersTable = ({ servers, setServers, currencies }: Props) => {
  const [currency, setCurrency] = useState("USD");
  const [changeRate, setChangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateRunningTime = setInterval(() => {
      setServers((prev) => {
        const updatedServers = prev.map((server) => {
          if (server.is_running)
            return {
              ...server,
              total_running_time: server.total_running_time + 1000,
            };
          return server;
        });
        return [...updatedServers];
      });
    }, 1000);

    return () => clearInterval(updateRunningTime);
  }, []);

  useEffect(() => {
    if (!currencies[currency]) return;
    setChangeRate(currencies[currency]);
  }, [currency]);

  const handleDelete = async (serverId: number) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/server/delete/${serverId}`
      );

      setServers((prev) => {
        prev = prev.filter((server) => server.id !== serverId);
        return [...prev];
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
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
      setIsLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/server/refresh`
      );

      setServers([...data.servers]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex ">
        <div className="flex flex-col">
          <div className="grid grid-cols-7 gap-2 w-full bg-slate-300 font-bold">
            <p>ip</p>
            <p>name</p>
            <p>time running</p>
            <p>toggle</p>
            <p>type</p>
            <p>price</p>
            <p>delete</p>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              {servers
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((server, i) => (
                  <div
                    className={`grid grid-cols-7 gap-2 w-full ${
                      i % 2 !== 0 && "bg-slate-200"
                    }`}
                    key={server.name}
                  >
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
                        server.price_per_minute *
                        changeRate
                      ).toFixed(2) + ` ${currency}`}
                    </p>
                    <button
                      className="w-fit"
                      onClick={() => handleDelete(server.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="self-end mt-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.currentTarget.value)}
              className="w-min border"
            >
              <option value="USD">USD</option>
              <option value="ILS">ILS</option>
              <option value="EUR">EUR</option>
            </select>
            <button className="border" onClick={handleRefresh}>
              refresh
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServersTable;