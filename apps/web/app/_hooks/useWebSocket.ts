import React, { SetStateAction, useEffect, useState } from "react";
import { Shapes } from "../_components/Canvas";
const ws_url = process.env.NEXT_PUBLIC_WS_BACKEND;
const useWebSocket = (
  token: string,
  roomId: string,
  setCurrentShapes: React.Dispatch<React.SetStateAction<Shapes[]>>,
  setCount: React.Dispatch<SetStateAction<number>>,
) => {
  const [client, setClient] = useState<WebSocket | null>(null);
  useEffect(() => {
    const client = new WebSocket(`${ws_url}?token=` + token);
    client.onopen = async () => {
      client.send(JSON.stringify({ type: "join-room", roomId: roomId }));
    };
    client.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log("message from server: ", data);
      if (data.type === "active_users") {
        setCount(data.count);
      }
      if (data.type === "chat") {
        console.log("shape: ", data.shape);
        setCurrentShapes((prev) => [...prev, data.shape]);
      }
    };
    client.onclose = () => {
      console.log("WebSocket connection closed");
    };
    setClient(client);
    return () => {
      client.close();
    };
  }, [roomId, setCurrentShapes, token, setCount]);
  return client;
};

export default useWebSocket;
