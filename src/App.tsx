import { PolygonCanvas } from "./components/PolygonAnnotations/Canvas";
import GoogleMap from "./components/Map";

const PUBLIC_GOOGLEMAPS_API_KEY = "AIzaSyDjcC3UTMdAi8cZXcK7POtXJ7TYf4KvdVE";

function App() {
  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          zIndex: 1,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <GoogleMap apiKey={PUBLIC_GOOGLEMAPS_API_KEY} />
      </div>
    </div>
  );
}

/*
<div
        style={{
          height: "400px",
          width: "100%",
          zIndex: 2,
          position: "absolute",
          left: 0,
          top: 30,
        }}
      >
        <PolygonCanvas username="Nicolas" />
      </div>
      */
export default App;
