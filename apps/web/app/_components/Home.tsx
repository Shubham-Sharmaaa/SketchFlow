"use client";
import axios from "axios";
import styles from "../page.module.css";
import { redirect, useRouter } from "next/navigation";
import { useRef } from "react";
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
const Home = () => {
  const router = useRouter();
  const roomIdRef = useRef<HTMLInputElement | null>(null);
  const joinRoom = async () => {
    const roomId = roomIdRef.current?.value;
    router.push(`room/${roomId}`);
  };
  const createRoom = async () => {
    try {
      const roomId = roomIdRef.current?.value;
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      const res = await axios.post(
        `${backend_url}/create-room`,
        {
          slug: roomId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
      const data = res.data;
      const room = data.room.slug;
      router.push(`room/${room}`);
    } catch (e) {
      alert(`something went wrong: ${e}`);
    }
  };
  return (
    <div className={styles.page}>
      <div className="text-amber-600 flex flex-col justify-center items-center gap-2">
        <input
          ref={roomIdRef}
          placeholder="slug"
          className="text-center bg-gray-100 rounded"
        />
        <button onClick={joinRoom} className="bg-amber-100 w-full rounded">
          Join Room
        </button>
        <button onClick={createRoom} className="bg-amber-200 w-full rounded">
          Create Room
        </button>
      </div>
    </div>
  );
};

export default Home;
