import { createFileRoute } from "@tanstack/react-router";
import { Canvas, Rect, Circle } from "fabric";
import { useEffect, useRef, useState } from "react";
import { BiRectangle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import Settings from "../conponents/Settings";

export const Route = createFileRoute("/fabric")({
  component: Fabric,
});

function Fabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 600,
        height: 600,
      });

      initCanvas.backgroundColor = "white";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        left: 100,
        top: 50,
        fill: "#ff0000",
        width: 50,
        height: 50,
      });
      canvas.add(rect);
      canvas.renderAll();
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        left: 100,
        top: 50,
        fill: "#00ff00",
        radius: 20,
      });
      canvas.add(circle);
      canvas.renderAll();
    }
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100 flex pt-36 justify-center">
      <div className="p-2 absolute bg-slate-900 flex flex-col gap-3 rounded-md top-1/3 left-3 ">
        <button
          onClick={addRectangle}
          className="active:bg-white/10 p-1.5 transition-all rounded-md"
        >
          <BiRectangle className="text-white size-6" />
        </button>
        <button
          onClick={addCircle}
          className="active:bg-white/10 p-1.5 transition-all rounded-md"
        >
          <FaRegCircle className="text-white size-6" />
        </button>
      </div>
      <canvas ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
