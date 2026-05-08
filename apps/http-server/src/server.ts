import "dotenv/config";
import express, { Response } from "express";
import cors from "cors";
const app = express();
app.use(cors());
import prisma from "@repo/db/client";
import { secret } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { Signup, Signin, CreateRoom } from "@repo/common/types";
import { authenticate, AuthRequest } from "./middlewares/middleware";
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    const data = Signup.safeParse(req.body);
    if (!data.success)
      return res.status(400).json({ message: "give proper input" });
    const { email, password, username } = data.data;
    const user = await prisma.user.create({
      data: {
        email,
        name: username,
        password,
        photo: "https://www.headshotpro.com/avatar-results/random-1.webp",
      },
    });
    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: "2d",
    });
    return res.status(200).json({ message: "user signed in", token });
  } catch (err) {
    return res.status(500).json({ message: "somethig went wrong", err });
  }
});
app.post("/signin", async (req, res) => {
  try {
    const data = Signin.safeParse(req.body);
    if (!data.success)
      return res.status(400).json({ message: "give proper input" });
    const { email, password } = data.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
    if (user) {
      const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn: "2d",
      });
      return res.status(200).json({ token });
    }
    return res.status(404).json({ message: "user not found" });
  } catch (err) {
    return res.status(500).json({ message: "somethig went wrong", err });
  }
});
app.post(
  "/create-room",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "unauthorized" });
      }
      const userId = req.userId;
      const parsedData = CreateRoom.safeParse(req.body);
      if (!parsedData.success)
        return res.status(400).json({ message: "give proper input" });
      const { slug } = parsedData.data;
      const room = await prisma.room.create({
        data: {
          slug,
          adminId: userId,
        },
      });

      return res.status(200).json({
        message: "room created",
        room,
      });
    } catch (err) {
      return res.status(500).json({ message: "somethig went wrong", err });
    }
  },
);
app.get(
  "/shapes/:slug",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      console.log("hitted ", req.params);
      const { slug } = req.params;

      if (typeof slug !== "string") return;
      const roomexist = await prisma.room.findFirst({
        where: {
          slug,
        },
      });
      if (!roomexist) {
        return res
          .status(404)
          .json({ message: "Room not found", success: false });
      }
      const messages = await prisma.chat.findMany({
        where: {
          roomId: roomexist.id,
        },
        take: 50,
        orderBy: {
          id: "desc",
        },
      });

      return res.status(200).json({
        message: "here is the messages",
        messages,
        roomId: roomexist.id,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "somethig went wrong", err, success: false });
    }
  },
);
app.get(
  "/get-username/:id",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;
      if (typeof id !== "string") return;
      const user = await prisma.user.findFirst({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "here is the username",
        name: user?.name,
      });
    } catch (err) {
      return res.status(500).json({ message: "somethig went wrong", err });
    }
  },
);
app.listen(3001, () => {
  console.log("server listening on port 3001");
});
