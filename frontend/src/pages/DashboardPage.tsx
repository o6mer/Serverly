import { useEffect, useState, useContext } from "react";
import ServersTable from "../components/dashboard/ServersTable";
import NewServerForm from "../components/dashboard/NewServerForm";
import axios from "axios";
import Loader from "../components/general/Loader";
import { IServerContext, ServerContext } from "../contexts/ServerContext";

const DashboardPage = () => {
  const [isLoadig, setIsLoading] = useState(false);

  const { setServers, setCurrencies, setServerTypes } = useContext(
    ServerContext
  ) as IServerContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: fetchedServers } = await axios.get(
          `${import.meta.env.VITE_API_URL}/server/servers`
        );
        const { data: fetchedServerTypes } = await axios.get(
          `${import.meta.env.VITE_API_URL}/server/server-types`
        );

        const { data: currencies } = await axios.get(
          `https://api.freecurrencyapi.com/v1/latest?apikey=${
            import.meta.env.VITE_CURRENCY_API_KEY
          }&currencies=EUR%2CUSD%2CILS`
        );

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
    <main className="h-full flex items-center justify-center ">
      <div className="w-fit flex flex-col gap-4 border p-8">
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
