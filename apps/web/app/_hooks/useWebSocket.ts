import React, { useEffect, useState } from "react";
import { Shapes } from "../_components/Canvas";

const useWebSocket = (
  token: string,
  roomId: string,
  setCurrentShapes: React.Dispatch<React.SetStateAction<Shapes[]>>,
) => {
  const [client, setClient] = useState<WebSocket | null>(null);
  useEffect(() => {
    const client = new WebSocket("ws://localhost:8080?token=" + token);
    client.onopen = async () => {
      client.send(JSON.stringify({ type: "join-room", roomId: roomId }));
    };
    client.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log("message from server: ", data);
      const shape = JSON.parse(data.shape);
      console.log("shape: ", shape);
      setCurrentShapes((prev) => [...prev, shape]);
    };
    client.onclose = () => {
      console.log("WebSocket connection closed");
    };
    setClient(client);
    return () => {
      client.close();
    };
  }, [roomId, setCurrentShapes, token]);
  return client;
};

export default useWebSocket;
