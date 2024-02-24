import { Rect } from "react-konva";
import { v4 as uuid } from "uuid";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;
import RectConfig = Konva.RectConfig;
import { Rectangle } from "../image-labeller/Rectangle.tsx";

interface StandardRectProps {
  rectangle: Rectangle;
}

export function StandardRect({ rectangle }: StandardRectProps) {
  return <Rect {...getStandardRectProps(rectangle)} />;
}

function getStandardRectProps(rectangle: Rectangle): RectConfig {
  return {
    x: rectangle.x,
    y: rectangle.y,
    width: rectangle.width,
    height: rectangle.height,
    fill: "grey",
    opacity: 0.5,
    // stroke: black, // breaks the build for some reason
    key: uuid(),
    _useStrictMode: true,
  };
}

interface SelectableRectProps {
  rectangle: Rectangle;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SelectableRect({
  rectangle,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: SelectableRectProps) {
  return (
    <Rect
      {...getStandardRectProps(rectangle)}
      {...getMouseSensitiveRectProps(onMouseEnter, onMouseLeave)}
      {...getSelectableRectProps(onSelect)}
    />
  );
}

function getSelectableRectProps(onSelect: () => void): RectConfig {
  return {
    onClick: onSelect,
    onTap: onSelect,
  };
}

function getMouseSensitiveRectProps(
  onMouseEnter: () => void,
  onMouseLeave: () => void,
): RectConfig {
  return {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
  };
}

interface DraggableRectProps {
  rectangle: Rectangle;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  setRectanglePosition: (x: number, y: number) => void;
  boundaryWidth: number;
  boundaryHeight: number;
}

export function DraggableRect({
  rectangle,
  onMouseEnter,
  onMouseLeave,
  setRectanglePosition,
  boundaryWidth,
  boundaryHeight,
}: DraggableRectProps) {
  return (
    <Rect
      {...getStandardRectProps(rectangle)}
      {...getMouseSensitiveRectProps(onMouseEnter, onMouseLeave)}
      {...getDraggableRectProps(
        rectangle,
        setRectanglePosition,
        boundaryWidth,
        boundaryHeight,
      )}
    />
  );
}

function getDraggableRectProps(
  rectangle: Rectangle,
  setRectanglePosition: (x: number, y: number) => void,
  boundaryWidth: number,
  boundaryHeight: number,
): RectConfig {
  return {
    draggable: true,
    onDragEnd: (e: KonvaEventObject<DragEvent>) => {
      setRectanglePosition(e.target.x(), e.target.y());
    },
    dragBoundFunc: (vector: Vector2d) => {
      return {
        x: Math.max(Math.min(vector.x, boundaryWidth - rectangle.width), 0),
        y: Math.max(Math.min(vector.y, boundaryHeight - rectangle.height), 0),
      };
    },
  };
}
