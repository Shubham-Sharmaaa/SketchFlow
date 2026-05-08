import axios from "axios";
import { Shapes } from "../_components/Canvas";
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
export class Line {
  x: number;
  y: number;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.ctx = ctx;
    this.canvas = canvas;
  }
  draw(clientX: number, clientY: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(clientX, clientY);
    this.ctx.stroke();
  }
  handleMouseDown = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.x = e.clientX - r.left;
    this.y = e.clientY - r.top;
  };
  handleMouseMove = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.draw(e.clientX - r.left, e.clientY - r.top);
  };
  handleMouseUp = (
    e: MouseEvent,
    setCurrentShapes: React.Dispatch<React.SetStateAction<Shapes[]>>,
  ) => {
    const r = this.canvas.getBoundingClientRect();
    const x2 = e.clientX - r.left;
    const y2 = e.clientY - r.top;
    const newLine: Shapes = {
      type: "line",
      x: this.x,
      y: this.y,
      x2,
      y2,
    };
    setCurrentShapes((prev) => [...prev, newLine]);
    return newLine;
  };
}
