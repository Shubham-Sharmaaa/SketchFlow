import { Shapes } from "./Canvas";

const Renderer = (currentShapes: Shapes[], ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  currentShapes.forEach((shape) => {
    if (shape.type == "rectangle") {
      if (
        shape.x === undefined ||
        shape.y === undefined ||
        shape.width === undefined ||
        shape.height === undefined
      )
        return;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.type == "line") {
      if (
        shape.x === undefined ||
        shape.y === undefined ||
        shape.x2 === undefined ||
        shape.y2 === undefined
      )
        return;
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    }
  });
};

export default Renderer;
