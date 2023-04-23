import { useEffect, useState, useContext } from "react";
import ServersTable from "../components/dashboard/ServersTable";
import NewServerForm from "../components/dashboard/NewServerForm";
import axios from "axios";
import Loader from "../components/general/Loader";
import { IServerContext, ServerContext } from "../contexts/ServerContext";

const DashboardPage = () => {
  const [isLoadig, setIsLoading] = useState(true);

  const { setServers, setCurrencies, setServerTypes } = useContext(
    ServerContext
  ) as IServerContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          { data: fetchedServers },
          { data: fetchedServerTypes },
          { data: currencies },
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/server/servers`),
          axios.get(`${import.meta.env.VITE_API_URL}/server/server-types`),
          axios.get(`${import.meta.env.VITE_API_URL}/util/currencies`),
        ]);

        setCurrencies({ ...currencies.data });
        setServers([...fetchedServers.servers]);
        setServerTypes([...fetchedServerTypes.serverTypes]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setCurrencies, setServers, setServerTypes]);

  return (
    <main className="h-full w-full max-w-screen flex items-center justify-center ">
      <div className="md:w-fit w-full flex flex-col items-center gap-4 border p-8">
        {isLoadig ? (
          <Loader />
        ) : (
          <>
            <ServersTable />
            <NewServerForm />
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
