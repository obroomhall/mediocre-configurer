import Konva from "konva";
import useKonvaRectangle from "./UseKonvaRectangle.ts";
import useCursor from "./UseCursor.ts";
import styles from "./ImageLabellerWindow.module.css";
import { Image, Layer, Stage } from "react-konva";
import { DraggableRect, SelectableRect, StandardRect } from "./KonvaRect.tsx";
import KonvaEventObject = Konva.KonvaEventObject;
import {
  Rectangle,
  Rectangles,
  scaleRectangle,
} from "../image-labeller/Rectangle.tsx";
import useContainerImage, {
  ContainerDimensions,
} from "../image-labeller/UseContainerImage.ts";

import { RectangleAction } from "../image-labeller/RectangleAction.tsx";

interface ImageLayerProps {
  image: HTMLImageElement;
  dimensions: ContainerDimensions;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

function ImageLayer({
  image,
  dimensions,
  onMouseDown,
  onMouseEnter,
}: ImageLayerProps) {
  return (
    <Layer>
      <Image
        image={image}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
      />
    </Layer>
  );
}

interface RectanglesLayerProps {
  rectangles: Rectangles;
  selectRectangleId: (id: string) => void;
  onMouseEnterRectangle: (id: string) => void;
  onMouseLeaveRectangle: (id: string) => void;
}

function RectanglesLayer({
  rectangles,
  selectRectangleId,
  onMouseEnterRectangle,
  onMouseLeaveRectangle,
}: RectanglesLayerProps) {
  const selectableRects = Object.entries(rectangles).map(([id, rectangle]) => (
    <SelectableRect
      key={id}
      rectangle={rectangle}
      onSelect={() => selectRectangleId(id)}
      onMouseEnter={() => onMouseEnterRectangle(id)}
      onMouseLeave={() => onMouseLeaveRectangle(id)}
    />
  ));
  return <Layer>{selectableRects}</Layer>;
}

interface ActionableRectangleLayerProps {
  rectangle: Rectangle;
  containerDimensions: ContainerDimensions;
  setRectangle: (rectangle: Rectangle) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function ActionableRectangleLayer({
  rectangle,
  containerDimensions,
  setRectangle,
  onMouseEnter,
  onMouseLeave,
}: ActionableRectangleLayerProps) {
  return (
    <Layer>
      <DraggableRect
        rectangle={rectangle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        setRectanglePosition={(x: number, y: number) => {
          rectangle.x = x;
          rectangle.y = y;
          setRectangle(rectangle);
        }}
        boundaryWidth={containerDimensions.width}
        boundaryHeight={containerDimensions.height}
      />
    </Layer>
  );
}

interface DrawableRectangleLayerProps {
  rectangle: Rectangle;
}

function DrawableRectangleLayer({ rectangle }: DrawableRectangleLayerProps) {
  return (
    <Layer>
      <StandardRect rectangle={rectangle} />
    </Layer>
  );
}

interface ImageLabellerWindowStageProps {
  image: HTMLImageElement;
  rectangles: Rectangles;
  currentAction: RectangleAction;
  selectedRectangleId: string;
  selectRectangleId: (id: string) => void;
  onFinishAction: (rectangle: Rectangle) => void;
  dimensions: ContainerDimensions;
}

function ImageLabellerWindowStage({
  image,
  rectangles,
  currentAction,
  selectedRectangleId,
  selectRectangleId,
  onFinishAction,
  dimensions,
}: ImageLabellerWindowStageProps) {
  const {
    rectangle: rectangleBeingDrawn,
    isDrawing,
    onStartDrawing,
    onContinueDrawing,
    onFinishDrawing,
  } = useKonvaRectangle(onFinishAction);

  const { cursor, setCursorOverRectangleId, resetCursorOverRectangleId } =
    useCursor(currentAction === RectangleAction.Drawing, selectedRectangleId);

  function onMouseDownOnImage(e: KonvaEventObject<MouseEvent>) {
    switch (currentAction) {
      case RectangleAction.Drawing:
        onStartDrawing(e);
        break;
      case RectangleAction.NoAction:
      case RectangleAction.Moving:
        selectRectangleId("");
        break;
    }
  }

  const selectedRectangle = rectangles[selectedRectangleId];
  const unselectedRectangles = Object.fromEntries(
    Object.entries(rectangles).filter(([id]) => id !== selectedRectangleId),
  );

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      style={{ cursor: cursor }}
      onMouseMove={(e) => isDrawing && onContinueDrawing(e)}
      onMouseUp={() => isDrawing && onFinishDrawing()}
    >
      <ImageLayer
        image={image}
        dimensions={dimensions}
        onMouseDown={onMouseDownOnImage}
        onMouseEnter={resetCursorOverRectangleId}
      />
      {currentAction !== RectangleAction.Drawing && (
        <RectanglesLayer
          rectangles={unselectedRectangles}
          selectRectangleId={selectRectangleId}
          onMouseEnterRectangle={setCursorOverRectangleId}
          onMouseLeaveRectangle={resetCursorOverRectangleId}
        />
      )}
      {currentAction !== RectangleAction.Drawing && selectedRectangle && (
        <ActionableRectangleLayer
          rectangle={selectedRectangle}
          containerDimensions={dimensions}
          setRectangle={onFinishAction}
          onMouseEnter={() => setCursorOverRectangleId(selectedRectangleId)}
          onMouseLeave={resetCursorOverRectangleId}
        />
      )}
      {rectangleBeingDrawn && (
        <DrawableRectangleLayer rectangle={rectangleBeingDrawn} />
      )}
    </Stage>
  );
}

function mapValues<T>(
  object: { [key: string]: T },
  func: (value: T) => T,
): { [key: string]: T } {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, func(value)]),
  );
}

interface ImageLabellerWindowProps {
  image: HTMLImageElement;
  rectangles: Rectangles;
  currentAction: RectangleAction;
  selectedRectangleId: string;
  selectRectangleId: (id: string) => void;
  onFinishAction: (rectangle: Rectangle) => void;
}

function ImageLabellerWindow({
  image,
  rectangles,
  currentAction,
  selectedRectangleId,
  selectRectangleId,
  onFinishAction,
}: ImageLabellerWindowProps) {
  const { ref, dimensions, scale } = useContainerImage(image);

  const onFinishActionScaled = (rectangle: Rectangle) => {
    return onFinishAction(scaleRectangle(rectangle, 1 / scale));
  };

  const scaledRectangles = mapValues(rectangles, (rectangle) =>
    scaleRectangle(rectangle, scale),
  );

  return (
    <div
      className={styles.imageLabellerWindow}
      style={{ width: "80%", height: dimensions.height }}
      ref={ref}
    >
      <ImageLabellerWindowStage
        image={image}
        rectangles={scaledRectangles}
        currentAction={currentAction}
        selectedRectangleId={selectedRectangleId}
        selectRectangleId={selectRectangleId}
        onFinishAction={onFinishActionScaled}
        dimensions={dimensions}
      />
    </div>
  );
}

export default ImageLabellerWindow;
