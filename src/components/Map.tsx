import { FC, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  AdvancedMarker,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

import { PolygonCanvas } from "./PolygonAnnotations/Canvas";
import PlaceAutocomplete from "./PlaceAutocomplete";
import MapHandler from "./MapHandler";
import { IconButton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import HighlightAltRoundedIcon from "@mui/icons-material/HighlightAltRounded";

export interface MapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  onCreateShape?: (e: any) => void;
  onPointsChanged?: (e: any) => void;
}

// @ts-ignore
function polygonArea(vertices) {
  let area = 0;
  let n = vertices.length;
  for (let i = 0; i < n; i++) {
    let j = (i + 1) % n;
    area += vertices[i][0] * vertices[j][1];
    area -= vertices[j][0] * vertices[i][1];
  }
  return Math.abs(area) / 2;
}

const GoogleMap: FC<MapProps> = ({
  lat = 0,
  lng = 0,
  onCreateShape,
  onPointsChanged,
}: MapProps) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [zoomLevel, setZoomLevel] = useState(19);
  const [mapView, setMapView] = useState("roadmap");
  const [isTrace, setIsTrace] = useState(false);
  const [plotArea, setPlotArea] = useState([]);
  const [coords, setCoords] = useState({});

  const getMetersPerPx = () => {
    const latitude = selectedPlace?.geometry?.location?.lat() || 0;
    return (
      (156543.03392 * Math.cos((latitude * Math.PI) / 180)) /
      Math.pow(2, zoomLevel)
    );
  };

  const getFeetPerPx = () => {
    return getMetersPerPx() * 3.28084;
  };

  const [markerRef, marker] = useAdvancedMarkerRef();

  const zoomIn = () => {
    setZoomLevel(zoomLevel + 1);
  };

  const zoomOut = () => {
    setZoomLevel(zoomLevel - 1);
  };

  const centerChanged = (e: any) => {
    setCoords(e.detail.center);
  };

  const createPolygon = (points: any) => {
    setPlotArea(points);

    if (onCreateShape)
      onCreateShape({
        zoomLevel,
        points,
        coords,
      });
  };

  const pointsChanged = (points: any) => {
    if (onPointsChanged) onPointsChanged(points);
  };

  const resetPolygon = () => {
    setIsTrace(false);
  };

  useEffect(() => {
    const areaPx = polygonArea(plotArea);
    const metersPerPixel = getMetersPerPx();
    const feetPerPixel = getFeetPerPx();

    console.log(areaPx + " square pixels");
    console.log(areaPx * metersPerPixel + " square meters");
    console.log(areaPx * feetPerPixel + " square feet");
    console.log((areaPx * feetPerPixel) / 4046.86 + " acres");
  }, [plotArea]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
      </Box>

      {selectedPlace && (
        <div
          style={{
            height: "calc(100vh - 64px)",
            width: "100%",
            zIndex: 1,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          <Map
            mapId={"address-map"}
            zoom={zoomLevel}
            defaultCenter={{ lat, lng }}
            mapTypeId={mapView}
            disableDefaultUI={true}
            onCenterChanged={centerChanged}
          >
            <AdvancedMarker ref={markerRef} position={null} />
          </Map>
          <MapHandler place={selectedPlace} marker={marker} />
        </div>
      )}

      {selectedPlace && (
        <div
          style={{
            zIndex: 1,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          Zoom: {zoomLevel}
          <br />
          Meters/Pixel {getMetersPerPx().toFixed(2)}
          <br />
          Feet/Pixel {getFeetPerPx().toFixed(2)}
          <br />
          Lat/Lng {lat}/{lng}
          <br />
          <label>
            <input
              type="checkbox"
              onClick={() =>
                setMapView(mapView === "hybrid" ? "roadmap" : "hybrid")
              }
            />{" "}
            Satellite
          </label>
          <br />
          <IconButton onClick={zoomIn} disabled={zoomLevel === 22 || isTrace}>
            <ZoomInIcon />
          </IconButton>
          <br />
          <IconButton onClick={zoomOut} disabled={zoomLevel === 2 || isTrace}>
            <ZoomOutIcon />
          </IconButton>
          <br />
          <IconButton
            onClick={() => setIsTrace(!isTrace)}
            disabled={zoomLevel === 2}
          >
            <HighlightAltRoundedIcon />
          </IconButton>
        </div>
      )}

      {isTrace && (
        <Box
          sx={{
            height: "calc(100vh - 64px)",
            zIndex: 2,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          <PolygonCanvas
            onChangePoints={pointsChanged}
            onCreate={createPolygon}
            onReset={resetPolygon}
          />
        </Box>
      )}
    </>
  );
};

export default GoogleMap;
