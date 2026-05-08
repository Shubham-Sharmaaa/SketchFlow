"use client";
import { useRef, useEffect, useState } from "react";
import { PenLine, RectangleHorizontal } from "lucide-react";
import Renderer from "./Renderer";
import useWindowSize from "../_hooks/useWindowSize";
import useWebSocket from "../_hooks/useWebSocket";
import { useCanvasHandlers } from "../_hooks/useCanvasHandler";
export interface Shapes {
  type: "rectangle" | "circle" | "line";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
}
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTdkODVlMy02ZmExLTQyOTktOWI2NS1iMzkwNDQyOGRmNDciLCJpYXQiOjE3NzcxNDA3NTZ9.xfJa0CV25HqnlzqzN0PSljETJiUtXVMC0c03-iEdgNQ";

export type CurrentShape = {
  type: "rectangle" | "circle" | "line";
};
const Canvas = ({ roomId, shapes }: { roomId: string; shapes: Shapes[] }) => {
  const [currShapes, setCurrentShapes] = useState(shapes);
  const [activeShape, setActiveShape] = useState<CurrentShape | null>(null);

  const client = useWebSocket(token, roomId, setCurrentShapes);
  const size = useWindowSize();

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
    <>
      <div className="absolute flex gap-4 items-center py-2 px-8 top-12.5 left-40 bg-gray-700 min-w-[70%] text-white  rounded">
        <button
          onClick={() =>
            setActiveShape({
              type: "rectangle",
            })
          }
          className={
            activeShape?.type === "rectangle" ? "bg-red-200 " : "bg-transparent"
          }
        >
          <RectangleHorizontal />
        </button>
        <button
          onClick={() =>
            setActiveShape({
              type: "line",
            })
          }
          className={
            activeShape?.type === "line" ? "bg-red-200 " : "bg-transparent"
          }
        >
          <PenLine />
        </button>
      </div>
      <canvas
        ref={ctxref}
        width={size.width}
        height={size.height}
        className="bg-gray-400 "
      ></canvas>
    </>
  );
};

export default Canvas;
