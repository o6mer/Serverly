import { FormEvent, useState, useContext } from "react";
import axios from "axios";
import Loader from "../general/Loader";
// import InputMask from "react-input-mask";
import { IServerContext, ServerContext } from "../../contexts/ServerContext";
import MaskedInput from "react-text-mask";

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
        className="grid grid-cols-2 gap-4 content-stretch"
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
          Server IP
          <MaskedInput
            mask={(value) => Array(value.length).fill(/[\d.]/)}
            pipe={(value) => {
              if (value === "." || value.endsWith("..")) return false;

              const parts = value.split(".");

              if (
                parts.length > 4 ||
                parts.some(
                  (part) =>
                    part === "00" || Number(part) < 0 || Number(part) > 255
                )
              ) {
                return false;
              }

              return value;
            }}
            placeholderChar={"\u2000"}
            keepCharPositions={true}
            showMask
            className="border"
            placeholder="0.0.0.0"
            guide={false}
            id="server-ip"
            type="text"
            onChange={(e) => setServerIp(e.currentTarget.value)}
            value={serverIp}
            required
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
