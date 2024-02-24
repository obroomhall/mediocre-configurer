import { useMeasure } from "react-use";

export interface ContainerDimensions {
  width: number;
  height: number;
}

function useContainerImage(image: HTMLImageElement) {
  const [ref, { width: containerWidth }] = useMeasure<HTMLDivElement>();

  const naturalRatio = image.naturalWidth / image.naturalHeight;
  const width = containerWidth;
  const height = containerWidth / naturalRatio;
  const dimensions: ContainerDimensions = { width, height };

  const scale = width / image.naturalWidth;

  return {
    ref,
    dimensions,
    scale,
  };
}

export default useContainerImage;
