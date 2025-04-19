import { Canvas, Circle, FabricObject } from "fabric";
import { ChangeEvent, useEffect, useState } from "react";

interface SettingsProps {
  canvas: Canvas | null;
}

export default function Settings({ canvas }: SettingsProps) {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null,
  );
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e) => {
        handleObjectSelected(e.selected[0]);
      });
      canvas.on("selection:updated", (e) => {
        handleObjectSelected(e.selected[0]);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", (e) => {
        handleObjectSelected(e.target);
      });
      canvas.on("object:scaling", (e) => {
        handleObjectSelected(e.target);
      });
    }
  }, [canvas]);

  const handleObjectSelected = (object: FabricObject) => {
    if (!object) return;
    setSelectedObject(object);
    if (object.type === "rect") {
      setWidth(Math.round(object.width * object.scaleX).toString());
      setHeight(Math.round(object.height * object.scaleY).toString());

      if (object.fill) {
        setColor(object.fill?.toString());
      }

      setDiameter("");
    } else if (object.type === "circle") {
      const circle = object as Circle;
      setDiameter(Math.round(circle.radius * 2 * circle.scaleX).toString());

      if (object.fill) {
        setColor(object.fill?.toString());
      }

      setWidth("");
      setHeight("");
    }
  };

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
  };

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setWidth(intValue.toString());

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      canvas?.renderAll();
    }
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setHeight(intValue.toString());

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ height: intValue / selectedObject.scaleX });
      canvas?.renderAll();
    }
  };

  const handleDiameterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setDiameter(intValue.toString());

    if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX });
      canvas?.renderAll();
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas?.renderAll();
    }
  };
  return (
    <div className="absolute bottom-1/4 p-3 inset-x-0 flex flex-col gap-3 mx-auto w-32 bg-slate-900 rounded-md text-white">
      {selectedObject && selectedObject.type === "rect" && (
        <>
          <label htmlFor="Width">
            Width
            <input
              className="w-full"
              id="Width"
              name="Width"
              value={width}
              type="number"
              min={0}
              onChange={handleWidthChange}
            />
          </label>
          <label htmlFor="Height">
            Height
            <input
              className="w-full"
              id="Height"
              name="Height"
              value={height}
              type="number"
              min={0}
              onChange={handleHeightChange}
            />
          </label>
          <label htmlFor="Color">
            Color
            <input
              className="w-full"
              id="Color"
              name="Color"
              value={color}
              type="color"
              onChange={handleColorChange}
            />
          </label>
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <>
          <label htmlFor="Height">
            Diameter
            <input
              className="w-full"
              id="Diameter"
              name="Diameter"
              value={diameter}
              type="number"
              min={0}
              onChange={handleDiameterChange}
            />
          </label>
          <label htmlFor="Color">
            Color
            <input
              className="w-full"
              id="Color"
              name="Color"
              value={color}
              type="color"
              onChange={handleColorChange}
            />
          </label>
        </>
      )}
    </div>
  );
}
