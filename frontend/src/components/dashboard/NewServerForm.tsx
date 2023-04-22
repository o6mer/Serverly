import { FormEvent, useState, useContext } from "react";
import axios from "axios";
import Loader from "../general/Loader";
import InputMask from "react-input-mask";
import { IServerContext, ServerContext } from "../../contexts/ServerContext";

const NewServerForm = () => {
  const [serverName, setServerName] = useState("");
  const [serverIp, setServerIp] = useState("");
  const [serverTypeId, setServerTypeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setServers, serverTypes } = useContext(
    ServerContext
  ) as IServerContext;

  const clearForm = () => {
    setServerName("");
    setServerIp("");
    setServerTypeId("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!serverName || !serverTypeId || !serverIp) return;

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/new`,
        {
          serverName,
          serverIp,
          serverTypeId,
        }
      );

      setServers((prev) => [...prev, data.server]);
      clearForm();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <section className="self-start ">
      <form
        action=""
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <label htmlFor="server-name" className="flex flex-col">
          Server Name{" "}
          <input
            placeholder="My Server..."
            required
            type="text"
            id="server-name"
            className="border"
            value={serverName}
            onChange={(e) => setServerName(e.currentTarget.value)}
          />
        </label>

        <label htmlFor="server-ip" className="flex flex-col">
          Server IP{" "}
          <InputMask
            placeholder="000.000.000.000"
            maskChar=""
            required
            mask="999.999.999.999"
            value={serverIp}
            onChange={(e) => setServerIp(e.currentTarget.value)}
            type="text"
            id="server-ip"
            className="border"
          />
        </label>

        <select
          required
          name=""
          id=""
          value={serverTypeId}
          onChange={(e) => setServerTypeId(e.currentTarget.value)}
        >
          <option value="" disabled>
            Server Type
          </option>
          {serverTypes.map((type) => (
            <option value={type.type_id} key={type.type_name}>
              {type.type_name} ({type.price_per_minute}$/minute)
            </option>
          ))}
        </select>
        {isLoading ? (
          <Loader />
        ) : (
          <button className="border" type="submit">
            Add Server
          </button>
        )}
      </form>
    </section>
  );
};

export default NewServerForm;
