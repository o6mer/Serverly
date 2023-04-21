import React, { useEffect, useState } from "react";
import ServersTable from "../components/dashboard/ServersTable";
import NewServerForm from "../components/dashboard/NewServerForm";
import axios from "axios";
import { Server } from "../types";

const DashboardPage = () => {
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/server`
      );
      console.log(data);
      setServers([...data.servers]);
    };
    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <ServersTable servers={servers} />
      <NewServerForm />
    </div>
  );
};

export default DashboardPage;
