import React, { useEffect, useState } from "react";
import ServersTable from "../components/dashboard/ServersTable";
import NewServerForm from "../components/dashboard/NewServerForm";
import axios from "axios";
import { Server, ServerType } from "../types";

const DashboardPage = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [serverTypes, setServerTypes] = useState<ServerType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/server`
      );
      console.log(data);
      setServers([...data.servers]);
      setServerTypes([...data.serverTypes]);
    };
    fetchData();
  }, []);

  return (
    <main className="h-full flex items-center justify-center">
      <div className="w-fit flex flex-col gap-4">
        <ServersTable servers={servers} setServers={setServers} />
        <NewServerForm serverTypes={serverTypes} setServers={setServers} />
      </div>
    </main>
  );
};

export default DashboardPage;
