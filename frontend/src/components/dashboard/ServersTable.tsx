import { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import { msToHMS } from "../../utils/timeFormats";
import Loader from "../general/Loader";
import { IServerContext, ServerContext } from "../../contexts/ServerContext";

const ServersTable = () => {
  const [currency, setCurrency] = useState("USD");
  const [isLoading, setIsLoading] = useState(false);

  const { currencies, servers, setServers } = useContext(
    ServerContext
  ) as IServerContext;

  const changeRate = useMemo(
    () => currencies[currency],
    [currencies, currency]
  );

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
  }, [setServers]);

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
      await axios.post(
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
    <section className="flex flex-col md:items-center w-full md:w-fit">
      <div className="overflow-x-auto">
        <table className="w-full ">
          <thead>
            <tr className=" text-left bg-gray-300 w-full">
              <th>IP</th>
              <th>Name</th>
              <th>Time Running</th>
              <th>Toggle</th>
              <th>Type</th>
              <th>Price</th>
              <th>Delete</th>
            </tr>
          </thead>
          {isLoading ? (
            <Loader />
          ) : (
            <tbody>
              {servers.length ? (
                servers
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((server, i) => (
                    <tr
                      className={`w-max ${i % 2 !== 0 && "bg-slate-200"}`}
                      key={server.name}
                    >
                      <td>{server.ip}</td>
                      <td>{server.name}</td>
                      <td>
                        {server.total_running_time
                          ? msToHMS(server.total_running_time)
                          : "00:00:00"}
                      </td>
                      <td>
                        <button
                          className="border w-fit"
                          onClick={() => handleToggle(server.id)}
                        >
                          {server.is_running ? "Turn Off" : "Turn On"}
                        </button>
                      </td>
                      <td>{server.type_name}</td>
                      <td>
                        {(
                          (server.total_running_time / 60000) *
                          server.price_per_minute *
                          changeRate
                        ).toFixed(2) + ` ${currency}`}
                      </td>
                      <td>
                        <button
                          className="w-fit"
                          onClick={() => handleDelete(server.id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <div> No Servers Yet...</div>
              )}
            </tbody>
          )}
        </table>
      </div>

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
    </section>
  );
};

export default ServersTable;
