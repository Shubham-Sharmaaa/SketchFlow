import { Circle, PenLine, RectangleHorizontal } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { CurrentShape } from "./Canvas";
const ItemBar = ({
  setActiveShape,
  activeShape,
}: {
  setActiveShape: Dispatch<SetStateAction<CurrentShape | null>>;
  activeShape: CurrentShape | null;
}) => {
  return (
    <div className="absolute top-2 flex w-screen justify-center">
      <div className="flex  gap-4 items-center px-8 py-2 bg-gray-700 rounded-xl text-white shadow-lg">
        <button
          onClick={() => setActiveShape({ type: "rectangle" })}
          className={
            activeShape?.type === "rectangle" ? "bg-red-200 " : "bg-transparent"
          }
        >
          <RectangleHorizontal />
        </button>
        <button
          onClick={() => setActiveShape({ type: "line" })}
          className={
            activeShape?.type === "line" ? "bg-red-200 " : "bg-transparent"
          }
        >
          <PenLine />
        </button>
        <button
          onClick={() => setActiveShape({ type: "circle" })}
          className={
            activeShape?.type === "circle" ? "bg-red-200 " : "bg-transparent"
          }
        >
          <Circle />
        </button>
      </div>
    </div>
  );
};

export default ItemBar;
