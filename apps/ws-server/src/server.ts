import dotenv from "dotenv";
dotenv.config();
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { secret } from "@repo/backend-common/config";
import prisma from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });
interface user {
  ws: WebSocket;
  rooms: string[];
}
let users: user[] = [];
function checkuser(token: string): string | null {
  try {
    const decode = jwt.verify(token, secret);
    if (typeof decode === "string") return null;
    if (!decode.userId) return null;
    return decode.userId;
  } catch (e) {
    return null;
  }
}
wss.on("connection", (ws, request) => {
  console.log("new connection", request.url);

  const url = request.url;
  if (!url) return;
  const params = new URLSearchParams(url.split("?")[1]);
  const token = params.get("token") || "";
  const userId = checkuser(token);
  if (userId === null) return ws.close();
  console.log("user connected");
  users.push({ ws, rooms: [] });
  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      console.log("message received: ", parsedData);
      const { type, shape, roomId } = parsedData;
      if (!roomId) return;

      if (type === "join-room") {
        const user = users.find((u) => u.ws === ws);
        if (!user || user?.rooms.includes(roomId)) return;
        user.rooms.push(roomId);
      }
      if (type === "leave-room") {
        const user = users.find((u) => u.ws === ws);
        if (!user?.rooms.includes(roomId)) return;
        user.rooms = user.rooms.filter((r) => r !== roomId);
      }
      if (type === "chat" && shape) {
        const user = users.find((u) => u.ws === ws);
        if (!user || !user.rooms.includes(roomId)) return;

        await prisma.chat.create({
          data: {
            message: JSON.stringify(shape),
            userId,
            roomId: Number(roomId),
          },
        });
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            console.log("sending message to user in room: ", roomId);
            user.ws.send(
              JSON.stringify({
                type: "chat",
                shape: JSON.stringify(shape),
                roomId,
              }),
            );
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
  ws.on("close", () => {
    users = users.filter((user) => user.ws !== ws);
    console.log("connection closed");
  });
});
