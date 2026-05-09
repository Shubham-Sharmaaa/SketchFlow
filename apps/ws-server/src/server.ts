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
function broadcastActiveUser(roomId: string) {
  let cnt = 0;

  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      cnt++;
    }
  });
  console.log("broadcasting active users:", cnt);
  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      user.ws.send(
        JSON.stringify({
          type: "active_users",
          count: cnt,
        }),
      );
    }
  });
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
      if (type === "redo") {
        const lastShape = await prisma.chat.findFirst({
          where: {
            roomId,
            isDeleted: true,
          },
          orderBy: {
            id: "desc",
          },
        });
        if (lastShape) {
          await prisma.chat.update({
            where: {
              id: lastShape.id,
            },
            data: {
              isDeleted: false,
            },
          });
        }
      }
      if (type === "undo") {
        const lastShape = await prisma.chat.findFirst({
          where: {
            roomId,
            isDeleted: false,
          },
          orderBy: {
            id: "desc",
          },
        });
        if (lastShape) {
          await prisma.chat.update({
            where: {
              id: lastShape.id,
            },
            data: {
              isDeleted: true,
            },
          });
        }
      }
      if (!roomId) return;
      if (type === "join-room") {
        const user = users.find((u) => u.ws === ws);
        if (!user || user?.rooms.includes(roomId)) return;
        user.rooms.push(roomId);
        console.log("joining room", users);
        broadcastActiveUser(roomId);
      }
      if (type === "leave-room") {
        const user = users.find((u) => u.ws === ws);
        if (!user?.rooms.includes(roomId)) return;
        user.rooms = user.rooms.filter((r) => r !== roomId);
        broadcastActiveUser(roomId);
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
        await prisma.chat.deleteMany({
          where: {
            roomId,
            isDeleted: true,
          },
        });
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            console.log("sending message to user in room: ", roomId);
            user.ws.send(
              JSON.stringify({
                type: "chat",
                shape,
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
    const user = users.find((user) => user.ws === ws);
    if (user) {
      const rooms = [...user.rooms];
      users = users.filter((user) => user.ws !== ws);
      rooms.forEach((roomId) => broadcastActiveUser(roomId));
    }
    console.log("connection closed");
  });
});
