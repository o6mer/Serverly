import { useState, ReactNode, createContext } from "react";
import { Server, ServerType } from "../types";

export interface IServerContext {
  servers: Server[];
  setServers: React.Dispatch<React.SetStateAction<Server[]>>;
  serverTypes: ServerType[];
  setServerTypes: React.Dispatch<React.SetStateAction<ServerType[]>>;
  currencies: { [key: string]: number };
  setCurrencies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
}

export const ServerContext = createContext<IServerContext | null>(null);

const ServerContextProvider = ({ children }: { children: ReactNode }) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [serverTypes, setServerTypes] = useState<ServerType[]>([]);
  const [currencies, setCurrencies] = useState<{ [key: string]: number }>({});

  return (
    <ServerContext.Provider
      value={{
        servers,
        setServers,
        serverTypes,
        setServerTypes,
        currencies,
        setCurrencies,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerContextProvider;
