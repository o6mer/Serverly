import { useContext } from "react";
import { IServerContext, ServerContext } from "../../contexts/ServerContext";
import { msToHMS } from "../../utils/timeFormats";
import { Server } from "../../types";

interface Props {
  server: Server;
  handleToggle: (serveId: number) => void;
  handleDelete: (serveId: number) => void;
}

const ServerRow = ({ server, handleToggle, handleDelete }: Props) => {
  const { currency } = useContext(ServerContext) as IServerContext;

  return (
    <tr className={`w-max`} key={server.name}>
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
          currency.rate
        ).toFixed(2) + ` ${currency.name}`}
      </td>
      <td>
        <button className="w-fit" onClick={() => handleDelete(server.id)}>
          X
        </button>
      </td>
    </tr>
  );
};

export default ServerRow;
