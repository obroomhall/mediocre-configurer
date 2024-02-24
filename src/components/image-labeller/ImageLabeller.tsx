import styles from "./ImageLabeller.module.css";
import { Rectangle, Rectangles } from "./Rectangle";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import Dialog from "../dialog/Dialog";
import useImage from "use-image";
import { RectangleAction } from "./RectangleAction";
import ImageLabellerWindow from "../image-labeller-window/ImageLabellerWindow";

interface ImageLabellerProps {
  image: string;
  rectangles: Rectangles;
  setRectangles: (rectangles: Rectangles) => void;
}

function ImageLabeller({
  image,
  rectangles,
  setRectangles,
}: ImageLabellerProps) {
  const [activeRectangleId, setActiveRectangleId] = useState("");
  const [currentAction, setCurrentAction] = useState(RectangleAction.NoAction);
  const [canvasImage, canvasImageStatus] = useImage(image);

  const onAdd = () => {
    setActiveRectangleId(uuid());
    setCurrentAction(RectangleAction.Drawing);
  };

  const onSelect = (id: string) => {
    setActiveRectangleId(id);
    setCurrentAction(RectangleAction.Moving);
  };

  const onRedraw = () => {
    setCurrentAction(RectangleAction.Drawing);
  };

  const onDelete = () => {
    setCurrentAction(RectangleAction.Deleting);
  };

  const onCancel = () => {
    resetRectangleAndAction();
  };

  function resetRectangleAndAction() {
    setActiveRectangleId("");
    setCurrentAction(RectangleAction.NoAction);
  }

  const onFinishAction = (rectangle?: Rectangle) => {
    if (!rectangle) {
      rectangle = rectangles[activeRectangleId];
    }

    if (!rectangle) {
      throw Error(`Could not find rectangle ${activeRectangleId}`);
    }

    switch (currentAction) {
      case RectangleAction.Drawing:
        rectangles[activeRectangleId] = rectangle;
        resetRectangleAndAction();
        break;
      case RectangleAction.Moving:
        rectangles[activeRectangleId] = rectangle;
        break;
      case RectangleAction.Deleting:
        delete rectangles[activeRectangleId];
        resetRectangleAndAction();
        break;
      case RectangleAction.NoAction:
        throw Error(`No action for rectangle ${JSON.stringify(rectangle)}`);
    }

    setRectangles(rectangles);
  };

  return (
    <div className={styles.imageLabeller}>
      {canvasImage ? (
        <ImageLabellerWindow
          image={canvasImage}
          rectangles={rectangles}
          currentAction={currentAction}
          selectedRectangleId={activeRectangleId}
          selectRectangleId={onSelect}
          onFinishAction={onFinishAction}
        />
      ) : (
        canvasImageStatus
      )}
      {currentAction === RectangleAction.Deleting && (
        <Dialog
          submitText="Delete"
          onSubmit={onFinishAction}
          cancelText="Cancel"
          onCancel={onCancel}
        >
          Are you sure you want to delete {activeRectangleId}?
        </Dialog>
      )}
    </div>
  );
}

export default ImageLabeller;
