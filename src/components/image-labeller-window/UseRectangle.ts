import { useState } from "react";
import { getRectangle, Position } from "../image-labeller/Rectangle.tsx";

function useRectangle() {
  const [rectangleStartPosition, setRectangleStartPosition] =
    useState<Position>();
  const [rectangleEndPosition, setRectangleEndPosition] = useState<Position>();

  const resetRectanglePositions = () => {
    setRectangleStartPosition(undefined);
    setRectangleEndPosition(undefined);
  };

  let rectangle = null;
  if (rectangleStartPosition && rectangleEndPosition) {
    rectangle = getRectangle(rectangleStartPosition, rectangleEndPosition);
  }

  return {
    rectangle,
    setRectangleStartPosition,
    setRectangleEndPosition,
    resetRectanglePositions,
  };
}

export default useRectangle;
