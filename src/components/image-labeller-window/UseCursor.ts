import { useState } from "react";

function useCursor(isDrawing: boolean, selectedRectangleId: string) {
  const [cursorOverRectangleId, setCursorOverRectangleId] = useState("");
  const resetCursorOverRectangleId = () => setCursorOverRectangleId("");

  const cursorOverAnyRectangle = cursorOverRectangleId !== "";
  const cursorOverSelectedRectangle =
    cursorOverAnyRectangle && cursorOverRectangleId === selectedRectangleId;

  let cursor: string;
  if (isDrawing) {
    cursor = "crosshair";
  } else if (cursorOverSelectedRectangle) {
    cursor = "move";
  } else if (cursorOverAnyRectangle) {
    cursor = "pointer";
  } else {
    cursor = "default";
  }

  return {
    cursor,
    setCursorOverRectangleId,
    resetCursorOverRectangleId,
  };
}

export default useCursor;
