import { useEffect, useRef } from "react";
import Renderer from "../_components/Renderer";
import { drawshape } from "../_components/DrawShape";
import { CurrentShape, Shapes } from "../_components/Canvas";

export const useCanvasHandlers = (
  ctxref: React.RefObject<HTMLCanvasElement | null>,
  shapeRef: React.RefObject<Shapes[]>,
  activeShape: CurrentShape | null,
  setCurrentShapes: React.Dispatch<React.SetStateAction<Shapes[]>>,
  client: WebSocket | null,
  roomId: string,
) => {
  const clicked = useRef(false);
  useEffect(() => {
    const canvas = ctxref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    Renderer(shapeRef.current, ctx);
    if (!activeShape?.type) return;
    const shape = drawshape({
      shape: activeShape,
      ctx,
      canvas,
    });
    if (!shape) return;
    const handleMouseUp = (e: MouseEvent) => {
      const shap = shape.handleMouseUp(e, setCurrentShapes);
      client?.send(
        JSON.stringify({
          type: "chat",
          shape: shap,
          roomId: roomId,
        }),
      );
      clicked.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!clicked.current) return;
      Renderer(shapeRef.current, ctx);
      shape.handleMouseMove(e);
    };
    const handleMouseDown = (e: MouseEvent) => {
      shape.handleMouseDown(e);
      clicked.current = true;
    };
    canvas?.addEventListener("mousedown", handleMouseDown);
    canvas?.addEventListener("mouseup", handleMouseUp);
    canvas?.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeShape, client, roomId]);
};
