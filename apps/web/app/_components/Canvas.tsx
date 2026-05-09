"use client";
import { useRef, useEffect, useState } from "react";

import Renderer from "./Renderer";
import useWindowSize from "../_hooks/useWindowSize";
import useWebSocket from "../_hooks/useWebSocket";
import { useCanvasHandlers } from "../_hooks/useCanvasHandler";
import Header from "./Header";
import ItemBar from "./ItemBar";

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
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTdkODVlMy02ZmExLTQyOTktOWI2NS1iMzkwNDQyOGRmNDciLCJpYXQiOjE3NzcxNDA3NTZ9.xfJa0CV25HqnlzqzN0PSljETJiUtXVMC0c03-iEdgNQ";

export type CurrentShape = {
  type: "rectangle" | "circle" | "line";
};
const Canvas = ({
  roomId,
  shapes,
  slug,
}: {
  roomId: string;
  shapes: Shapes[];
  slug: string;
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
      </div>
    </div>
  );
};

export default Canvas;
