import React, { FormEvent, useState } from "react";
import { Server, ServerType } from "../../types";
import axios from "axios";

interface Props {
  serverTypes: ServerType[];
  setServers: React.Dispatch<React.SetStateAction<Server[]>>;
}

const NewServerForm = ({ serverTypes, setServers }: Props) => {
  const [serverName, setServerName] = useState("");
  const [serverIp, setServerIp] = useState("");
  const [serverType, setServerType] = useState("");

  const clearForm = () => {
    setServerName("");
    setServerIp("");
    setServerType("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!serverName || !serverType || !serverIp) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/server/new`,
        {
          serverName,
          serverIp,
          serverType,
        }
      );

      setServers((prev) => [...prev, data.server]);
      clearForm();
    } catch (err) {
      console.log(err);
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
            type="text"
            id="server-name"
            className="border"
            value={serverName}
            onChange={(e) => setServerName(e.currentTarget.value)}
          />
        </label>

        <label htmlFor="server-ip" className="flex flex-col">
          Server IP{" "}
          <input
            type="text"
            id="server-ip"
            className="border"
            value={serverIp}
            onChange={(e) => setServerIp(e.currentTarget.value)}
          />
        </label>

        <select
          name=""
          id=""
          value={serverType}
          onChange={(e) => setServerType(e.currentTarget.value)}
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

        <button className="border" type="submit">
          Add Server
        </button>
      </form>
    </section>
  );
};

export default NewServerForm;
