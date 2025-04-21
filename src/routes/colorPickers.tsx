import { createFileRoute } from "@tanstack/react-router";
import { HexColorPicker } from "react-colorful";
import { SketchPicker, Color, ColorResult } from "react-color";
import { useState } from "react";

export const Route = createFileRoute("/colorPickers")({
  component: RouteComponent,
});

function RouteComponent() {
  const [colorSec, setColorSec] = useState("#fff");

  const [color, setColor] = useState<{ background: Color }>({
    background: "#fff",
  });

  const handleChange = (color: ColorResult) => {
    setColor({ background: color.hex });
  };

  return (
    <div className="bg-slate-50 w-full h-screen p-20 flex gap-10 items-start">
      <div className="p-2 bg-white drop-shadow-2xl rounded-lg relative flex flex-col gap-3">
        <div className="flex gap-2 items-center ">
          <div
            className="size-10 rounded-md"
            style={{ background: colorSec }}
          ></div>
          <p className="flex-1 bg-cyan-50 rounded-md p-3 border-cyan-800 border text-cyan-800">
            {colorSec}
          </p>
        </div>
        <HexColorPicker color={colorSec} onChange={setColorSec} />
      </div>
      <SketchPicker color={color.background} onChange={handleChange} />
    </div>
  );
}
