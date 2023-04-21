import React, { useEffect, useState } from "react";
import ServersTable from "../components/dashboard/ServersTable";
import NewServerForm from "../components/dashboard/NewServerForm";
import axios from "axios";
import { Server, ServerType } from "../types";

const DashboardPage = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [serverTypes, setServerTypes] = useState<ServerType[]>([]);
  const [currencies, setCurrencies] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/server`
      );

      const { data: currencies } = await axios.get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${
          import.meta.env.VITE_CURRENCY_API_KEY
        }&currencies=EUR%2CUSD%2CILS`
      );

      console.log(currencies);

      setCurrencies({ ...currencies.data });
      setServers([...data.servers]);
      setServerTypes([...data.serverTypes]);
    };
    fetchData();
  }, []);

  return (
    <main className="h-full flex items-center justify-center">
      <div className="w-fit flex flex-col gap-4">
        <ServersTable
          servers={servers}
          setServers={setServers}
          currencies={currencies}
        />
        <NewServerForm serverTypes={serverTypes} setServers={setServers} />
      </div>
    </main>
  );
};

export default DashboardPage;
