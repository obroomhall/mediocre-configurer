import useRectangle from "./UseRectangle.ts";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import { useState } from "react";
import { Rectangle } from "../image-labeller/Rectangle.tsx";

function getPosition(event: KonvaEventObject<MouseEvent>) {
  return { x: event.evt.offsetX, y: event.evt.offsetY };
}

function useKonvaRectangle(persistRectangle: (rectangle: Rectangle) => void) {
  const {
    rectangle,
    setRectangleStartPosition,
    setRectangleEndPosition,
    resetRectanglePositions,
  } = useRectangle();

  const [isDrawing, setIsDrawing] = useState(false);

  const onStartDrawing = (e: KonvaEventObject<MouseEvent>) => {
    setRectangleStartPosition(getPosition(e));
    setRectangleEndPosition(getPosition(e));
    setIsDrawing(true);
  };

  const onContinueDrawing = (e: KonvaEventObject<MouseEvent>) => {
    setRectangleEndPosition(getPosition(e));
  };

  const onFinishDrawing = () => {
    if (rectangle) {
      persistRectangle(rectangle);
    }
    resetRectanglePositions();
    setIsDrawing(false);
  };

  return {
    rectangle,
    isDrawing,
    onStartDrawing,
    onContinueDrawing,
    onFinishDrawing,
  };
}

export default useKonvaRectangle;
