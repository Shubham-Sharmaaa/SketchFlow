import express from "express";
import prisma from "@repo/db/client";
import { secret } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { Signup, Signin } from "@repo/common/types";
const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    const data = Signup.safeParse(req.body);
    if (!data.success)
      return res.status(400).json({ message: "give proper input" });
    const { email, password, username } = req.body;
    const user = prisma.user.create({
      data: {
        email,
        name: username,
        password,
        photo: "https://www.headshotpro.com/avatar-results/random-1.webp",
      },
    });
    res.status(200).json({ message: "user signed in", user });
  } catch (err) {
    res.status(500).json({ message: "somethig went wrong", err });
  }
});
app.post("/signin", async (req, res) => {
  try {
    const data = Signin.safeParse(req.body);
    if (!data.success)
      return res.status(400).json({ message: "give proper input" });
    const { email, password } = req.body;

    const user = prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });
    if (user) {
      console.log(user);

      return res.status(200).json({ message: "here", user });
    }
    res.status(404).json({ message: "user not found" });
  } catch (err) {
    res.status(500).json({ message: "somethig went wrong", err });
  }
});
app.post("/create-room", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "somethig went wrong", err });
  }
});

app.listen(3001, () => {
  console.log("server listening on port 3000");
});
