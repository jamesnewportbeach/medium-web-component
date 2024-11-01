import Box from "@mui/material/Box";
import GoogleMap from "./components/Map";
import NavBar from "./components/NavBar";
import { APIProvider } from "@vis.gl/react-google-maps";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const PUBLIC_GOOGLEMAPS_API_KEY = "AIzaSyDjcC3UTMdAi8cZXcK7POtXJ7TYf4KvdVE";

function App() {
  const createPolygon = (e: any) => {
    console.log(e);
  };

  const pointsChanged = (e: any) => {
    console.log(e);
  };

  const resetPolygon = () => {
    console.log("Reset Shape");
  };

  return (
    <APIProvider
      apiKey={PUBLIC_GOOGLEMAPS_API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Box component="nav" sx={{ height: 64 }}>
          <NavBar />
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: "red",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <GoogleMap
            onPointsChanged={pointsChanged}
            onCreateShape={createPolygon}
            onReset={resetPolygon}
          />
        </Box>
      </Box>
    </APIProvider>
  );
}

export default App;
