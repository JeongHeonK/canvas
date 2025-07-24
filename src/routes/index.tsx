import { createFileRoute } from "@tanstack/react-router";
import Konva from "konva";
import { useRef, useState } from "react";
import { Layer, Line, Stage, Image } from "react-konva";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [tool, setTool] = useState("brush");
  const [lines, setLines] = useState<{ tool: string; points: number[] }[]>([]);
  const [lines2, setLines2] = useState<{ tool: string; points: number[] }[]>(
    []
  );
  const isDrawing = useRef(false);
  const leftLayerRef = useRef<Konva.Layer>(null);
  const [bitmapImage, setBitmapImage] = useState<HTMLImageElement | null>(null);

  const exportToBitmap = () => {
    const canvas = leftLayerRef.current?.getCanvas()._canvas;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const blobUrl = URL.createObjectURL(blob);
      const img = new window.Image();
      img.src = blobUrl;

      img.onload = () => {
        setBitmapImage(img);
        URL.revokeObjectURL(blobUrl); // 👈 메모리 누수 방지
      };
    }, "image/png");
    const mask = getMaskUint8Array(canvas);
    console.log(mask);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<DragEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;

    // To draw line
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp2 = () => {
    isDrawing.current = false;
  };

  const handleMouseDown2 = (e: Konva.KonvaEventObject<DragEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    setLines2([...lines2, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove2 = (e: Konva.KonvaEventObject<DragEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;

    // To draw line
    const lastLine = lines2[lines2.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines2.splice(lines2.length - 1, 1, lastLine);
    setLines2(lines2.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="brush">Brush</option>
        <option value="eraser">Eraser</option>
      </select>
      <div className="relative h-screen w-screen bg-gray-100 flex pt-36 justify-center">
        <Stage
          width={window.innerWidth / 2}
          height={window.innerHeight / 2}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer ref={leftLayerRef}>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={20}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
        <Stage
          width={window.innerWidth / 2}
          height={window.innerHeight / 2}
          onMouseDown={handleMouseDown2}
          onMousemove={handleMouseMove2}
          onMouseup={handleMouseUp2}
        >
          <Layer>
            {bitmapImage && (
              <Image
                width={window.innerWidth / 2} // 👈 강제 맞춤
                height={window.innerHeight / 2}
                image={bitmapImage}
              />
            )}
            {lines2
              .filter((line) => line.tool === "eraser")
              .map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={20}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
          </Layer>
        </Stage>
      </div>
      <button
        onClick={exportToBitmap}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          border: "1px solid #df4b26",
          borderRadius: "5px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        복사해서 우측에 붙이기
      </button>
    </>
  );
}

function getMaskUint8Array(canvas: HTMLCanvasElement): Uint8Array {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not found");

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const mask = new Uint8Array(width * height);
  console.log(imageData.data);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const alpha = imageData.data[i + 3]; // A
    const pixelIndex = i / 4;

    mask[pixelIndex] = alpha > 0 ? 1 : 0; // 알파가 있으면 1, 없으면 0
  }

  return mask;
}
