import { createFileRoute } from "@tanstack/react-router";
import { Canvas, Rect, Circle, Point, PencilBrush, Path } from "fabric";
import { useEffect, useRef, useState } from "react";
import { BiRectangle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import Settings from "../components/Settings";

export const Route = createFileRoute("/fabric")({
  component: Fabric,
});

interface ExtendedCanvas extends Canvas {
  isDragging?: boolean;
  lastPosX?: number;
  lastPosY?: number;
}

class TransparentEraserBrush extends PencilBrush {
  _finalizeAndAddPath() {
    const ctx = this.canvas.contextTop;
    ctx.closePath();
    if (this._points && this._points.length > 1) {
      const pathData = this.convertPointsToSVGPath(this._points).join("");
      const path = new Path(pathData, {
        fill: null,
        stroke: "rgba(0,0,0,1)", // stroke는 있어야 함
        strokeWidth: this.width,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        selectable: false,
        evented: false,
        globalCompositeOperation: "destination-out", // 🔥 핵심
      });

      this.canvas.add(path);
      this.canvas.requestRenderAll();
    }

    this._reset();
  }
}

function Fabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const isSpaceDown = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceDown.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceDown.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 600,
        height: 600,
      }) as ExtendedCanvas;

      initCanvas.backgroundColor = "white";
      initCanvas.on("mouse:wheel", (opt) => {
        const delta = opt.e.deltaY;
        let zoom = initCanvas.getZoom();
        zoom *= 0.999 ** delta; // 부드러운 줌
        zoom = Math.max(0.1, Math.min(zoom, 10)); // 줌 한계 설정

        const pointer = initCanvas.getViewportPoint(opt.e); // 마우스 위치 (canvas 좌표계)
        const point = new Point(pointer.x, pointer.y);

        initCanvas.zoomToPoint(point, zoom);

        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      initCanvas.on("mouse:down", (opt) => {
        const evt = opt.e;
        if ("clientX" in evt && isSpaceDown.current) {
          initCanvas.setCursor("grabbing");
          initCanvas.isDragging = true;
          initCanvas.selection = false;
          initCanvas.lastPosX = evt.clientX;
          initCanvas.lastPosY = evt.clientY;
        }
      });
      initCanvas.on("mouse:move", function (opt) {
        if (
          "clientX" in opt.e &&
          initCanvas.isDragging &&
          initCanvas.lastPosX &&
          initCanvas.lastPosY
        ) {
          const e = opt.e;
          const vpt = initCanvas.viewportTransform;
          vpt[4] += e.clientX - initCanvas.lastPosX;
          vpt[5] += e.clientY - initCanvas.lastPosY;
          initCanvas.requestRenderAll();
          initCanvas.lastPosX = e.clientX;
          initCanvas.lastPosY = e.clientY;
        }
      });
      initCanvas.on("mouse:up", function () {
        initCanvas.setViewportTransform(initCanvas.viewportTransform);
        initCanvas.isDragging = false;
        initCanvas.selection = true;
      });

      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
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

  const useEraser = () => {
    if (!canvas) return;

    canvas.isDrawingMode = true;
    const eraser = new TransparentEraserBrush(canvas);
    eraser.width = 30;
    canvas.freeDrawingBrush = eraser;
  };

  const usePencil = () => {
    if (!canvas) return;

    canvas.isDrawingMode = true;
    const pencil = new PencilBrush(canvas);
    pencil.color = "#000000";
    pencil.width = 5;
    canvas.freeDrawingBrush = pencil;
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
        <button
          onClick={useEraser}
          className="active:bg-white/10 p-1.5 transition-all rounded-md"
        >
          🧽 {/* 또는 지우개 아이콘 */}
        </button>
        <button
          onClick={usePencil}
          className="active:bg-white/10 p-1.5 transition-all rounded-md"
        >
          ✏️
        </button>
      </div>
      <canvas ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
