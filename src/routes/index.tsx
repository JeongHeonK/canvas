import { createFileRoute } from "@tanstack/react-router";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionRectangle, setSelectionRectangle] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const isSelecting = useRef(false);
  const transformerRef = useRef<Konva.Transformer>(null);
  const rectRefs = useRef(new Map());

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedIds.length && transformerRef.current) {
      // Get the nodes from the refs Map
      const nodes = selectedIds
        .map((id) => rectRefs.current.get(id))
        .filter((node) => node);

      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) {
      // Clear selection
      transformerRef.current.nodes([]);
    }
  }, [selectedIds]);

  // Click handler for stage
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If we are selecting with rect, do nothing
    if (selectionRectangle.visible) {
      return;
    }

    // If click on empty area - remove all selections
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      return;
    }

    // Do nothing if clicked NOT on our rectangles
    if (!e.target.hasName("rect")) {
      return;
    }

    const clickedId = e.target.id();

    // Do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      // If no key pressed and the node is not selected
      // select just one
      setSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      // If we pressed keys and node was selected
      // we need to remove it from selection
      setSelectedIds(selectedIds.filter((id) => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      // Add the node into selection
      setSelectedIds([...selectedIds, clickedId]);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Do nothing if we mousedown on any shape
    if (e.target !== e.target.getStage()) {
      return;
    }

    // Start selection rectangle
    isSelecting.current = true;
    const pos = e.target.getStage().getPointerPosition();

    if (!pos) {
      return;
    }

    setSelectionRectangle({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    });
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }
    if (!e.target) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) {
      return;
    }
    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x,
      y2: pos.y,
    });
  };

  const handleMouseUp = () => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }
    isSelecting.current = false;

    // Update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      setSelectionRectangle({
        ...selectionRectangle,
        visible: false,
      });
    });

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };

    const selected = rectangles.filter((rect) => {
      // Check if rectangle intersects with selection box
      return Konva.Util.haveIntersection(selBox, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    });

    setSelectedIds(selected.map((rect) => rect.id));
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const id = e.target.id();
    setRectangles((prevRects) => {
      const newRects = [...prevRects];
      const index = newRects.findIndex((r) => r.id === id);
      if (index !== -1) {
        newRects[index] = {
          ...newRects[index],
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return newRects;
    });
  };

  const handleTransformEnd = () => {
    // Find which rectangle(s) were transformed
    const nodes = transformerRef.current?.nodes();

    const newRects = [...rectangles];

    // Update each transformed node
    nodes?.forEach((node) => {
      const id = node.id();
      const index = newRects.findIndex((r) => r.id === id);

      if (index !== -1) {
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        // Update the state with new values
        newRects[index] = {
          ...newRects[index],
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        };
      }
    });

    setRectangles(newRects);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onClick={handleStageClick}
      className="pt-20"
    >
      <Layer>
        {/* Render rectangles directly */}
        {rectangles.map((rect) => (
          <Rect
            key={rect.id}
            id={rect.id}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={rect.fill}
            name={rect.name}
            draggable
            ref={(node) => {
              if (node) {
                rectRefs.current.set(rect.id, node);
              }
            }}
            onDragEnd={handleDragEnd}
          />
        ))}

        {/* Single transformer for all selected shapes */}
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          onTransformEnd={handleTransformEnd}
        />

        {/* Selection rectangle */}
        {selectionRectangle.visible && (
          <Rect
            x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
            y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
            width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
            height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
            fill="rgba(0,0,255,0.5)"
          />
        )}
      </Layer>
    </Stage>
  );
}

const initialRectangles = [
  {
    x: 60,
    y: 60,
    width: 100,
    height: 90,
    fill: "red",
    id: "rect1",
    name: "rect",
  },
  {
    x: 250,
    y: 100,
    width: 150,
    height: 90,
    fill: "green",
    id: "rect2",
    name: "rect",
  },
];
