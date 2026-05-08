import { Shapes } from "../_components/Canvas";
import Renderer from "../_components/Renderer";

export class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.ctx = ctx;
    this.canvas = canvas;
  }
  draw() {
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
  handleMouseUp = (
    e: MouseEvent,
    setCurrentShapes: React.Dispatch<React.SetStateAction<Shapes[]>>,
  ) => {
    const r = this.canvas.getBoundingClientRect();
    const width = e.clientX - this.x - r.left;
    const height = e.clientY - this.y - r.top;
    this.width = width;
    this.height = height;
    const newRect: Shapes = {
      type: "rectangle",
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
    setCurrentShapes((prev) => [...prev, newRect]);
    return newRect;
  };
  handleMouseMove = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    const width = e.clientX - this.x - r.left;
    const height = e.clientY - this.y - r.top;
    this.width = width;
    this.height = height;
    this.draw();
  };
  handleMouseDown = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
  };
}
