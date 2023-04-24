import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Loader from "../general/Loader";
import { IServerContext, ServerContext } from "../../contexts/ServerContext";
import ServerRow from "./ServerRow";

const ServersTable = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { servers, setServers, currencies, currency, setCurrency } = useContext(
    ServerContext
  ) as IServerContext;

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
        <table className="w-full">
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
            <tbody className=" [&>*:nth-child(even)]:bg-gray-200 ">
              {servers.length ? (
                servers
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((server) => (
                    <ServerRow
                      key={server.id}
                      server={server}
                      handleDelete={handleDelete}
                      handleToggle={handleToggle}
                    />
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
          value={currency.rate}
          onChange={(e) => {
            setCurrency({
              name: e.currentTarget.selectedOptions[0].id,
              rate: Number(e.currentTarget.value),
            });
          }}
          className="w-min border"
        >
          {Object.entries(currencies)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map((currency) => (
              <option value={currency[1]} id={currency[0]} key={currency[0]}>
                {currency[0]}
              </option>
            ))}
        </select>
        <button className="border" onClick={handleRefresh}>
          refresh
        </button>
      </div>
    </section>
  );
};

export default ServersTable;
