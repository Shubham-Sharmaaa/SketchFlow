import { useEffect, useRef } from "react";
import { Rectangle } from "../_shapes/rectangle";
import { Shapes } from "./Canvas";
import { Line } from "../_shapes/line";

export const drawshape = ({
  shape,
  ctx,
  canvas,
}: {
  shape: Shapes;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
}) => {
  switch (shape.type) {
    case "rectangle":
      return new Rectangle(ctx, canvas);
    case "line":
      return new Line(ctx, canvas);
    case "circle":
      return;
    default:
      return;
  }
};
