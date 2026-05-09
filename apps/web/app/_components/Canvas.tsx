"use client";
import { useRef, useEffect, useState } from "react";

import Renderer from "./Renderer";
import useWindowSize from "../_hooks/useWindowSize";
import useWebSocket from "../_hooks/useWebSocket";
import { useCanvasHandlers } from "../_hooks/useCanvasHandler";
import Header from "./Header";
import ItemBar from "./ItemBar";
import { Redo, Undo } from "lucide-react";
import axios from "axios";
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
export interface Shapes {
  type: "rectangle" | "circle" | "line";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  radius?: number;
}

export type CurrentShape = {
  type: "rectangle" | "circle" | "line";
};
const Canvas = ({
  roomId,
  shapes,
  slug,
  token,
}: {
  roomId: string;
  shapes: Shapes[];
  slug: string;
  token: string;
}) => {
  const [currShapes, setCurrentShapes] = useState(shapes);
  const [activeShape, setActiveShape] = useState<CurrentShape | null>(null);
  const [count, setCount] = useState(0);
  const client = useWebSocket(token, roomId, setCurrentShapes, setCount);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useWindowSize(containerRef);

  const ctxref = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef(currShapes);
  useCanvasHandlers(
    ctxref,
    shapeRef,
    activeShape,
    setCurrentShapes,
    client,
    roomId,
  );

  useEffect(() => {
    const canvas = ctxref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    Renderer(currShapes, ctx);
  }, [currShapes, size]);
  useEffect(() => {
    shapeRef.current = currShapes;
  }, [currShapes]);
  const undo = async () => {
    try {
      client?.send(
        JSON.stringify({
          type: "undo",
        }),
      );
      const res = await axios.get(`${backend_url}/shapes/${slug}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = res.data;
      console.log("data: ", data);
      const messages = data.messages;
      roomId = data.roomId;
      shapes = messages.map((message: any) => {
        return JSON.parse(message.message);
      });
      setCurrentShapes(shapes);
    } catch (err) {
      console.log(err);
    }
  };
  const redo = async () => {
    try {
      client?.send(
        JSON.stringify({
          type: "redo",
        }),
      );
      const res = await axios.get(`${backend_url}/shapes/${slug}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = res.data;
      console.log("data: ", data);
      const messages = data.messages;
      roomId = data.roomId;
      shapes = messages.map((message: any) => {
        return JSON.parse(message.message);
      });
      setCurrentShapes(shapes);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <Header slug={slug} count={count} client={client} roomId={roomId} />
      <div ref={containerRef} className=" relative flex-1 overflow-hidden">
        <canvas
          ref={ctxref}
          width={size.width}
          height={size.height}
          className="bg-gray-400 w-full h-full"
        />
        <ItemBar setActiveShape={setActiveShape} activeShape={activeShape} />
        <div className="absolute bottom-2 left-12 bg-gray-400 py-1 px-2 flex gap-2">
          <button
            onClick={undo}
            className="bg-gray-500 py-1 px-2 hover:bg-blue-600 hover:cursor-pointer"
          >
            <Undo />
          </button>
          <button
            onClick={redo}
            className="bg-gray-500  py-1 px-2 hover:bg-blue-600 hover:cursor-pointer"
          >
            <Redo />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
