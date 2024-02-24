import ImageLabeller from "../image-labeller/ImageLabeller.tsx";
import snapshotImage from "../../assets/snapshot.png";
import useLocalState from "../../hooks/UseLocalState.tsx";
import { Rectangles } from "../image-labeller/Rectangle.tsx";

function App() {
  const [rectangles, setRectangles] = useLocalState<Rectangles>({}, "regions");

  return (
    <ImageLabeller
      image={snapshotImage}
      rectangles={rectangles}
      setRectangles={setRectangles}
    />
  );
}

export default App;
