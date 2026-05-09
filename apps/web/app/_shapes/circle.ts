import React, { SetStateAction } from "react";
import { Shapes } from "../_components/Canvas";

export class Circle {
  x: number;
  y: number;
  radius: number;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.ctx = ctx;
    this.canvas = canvas;
  }
  draw = () => {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  };
  handleMouseDown = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.x = e.clientX - rect.x;
    this.y = e.clientY - rect.y;
  };
  handleMouseMove = (e: MouseEvent) => {
    const r = this.canvas.getBoundingClientRect();
    this.radius = e.clientX - this.x - r.x;
    this.draw();
  };
  handleMouseUp = (
    e: MouseEvent,
    setCurrentShapes: React.Dispatch<SetStateAction<Shapes[]>>,
  ) => {
    const r = this.canvas.getBoundingClientRect();
    this.radius = e.clientX - this.x - r.x;
    const newCircle: Shapes = {
      type: "circle",
      x: this.x,
      y: this.y,
      radius: this.radius,
    };
    setCurrentShapes((shapes) => [...shapes, newCircle]);
    return newCircle;
  };
}
