import { FC, useState, useEffect, useRef } from "react";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

export interface GoogleMapProps {
  apiKey: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

const GoogleMap: FC<GoogleMapProps> = ({
  apiKey,
  lat = 0,
  lng = 0,
  zoom = 19,
}: GoogleMapProps) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [zoomLevel, setZoomLevel] = useState(19);

  useEffect(() => {
    const metersPerPx =
      (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoomLevel);
    const feetPerPx = metersPerPx * 3.28084;
    console.log(metersPerPx);
    console.log(feetPerPx);
  }, [zoomLevel, lat]);

  const getMetersPerPx = () => {
    return (
      (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoomLevel)
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

  return (
    <APIProvider
      apiKey={apiKey}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
    >
      <Map
        mapId={"bf51a910020fa25a"}
        zoom={zoomLevel}
        defaultCenter={{ lat, lng }}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        onZoomChanged={(e) => setZoomLevel(e.detail.zoom)}
      >
        <AdvancedMarker ref={markerRef} position={null} />
      </Map>
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
          Zoom: {zoomLevel}
          <br />
          Meters/Pixel {getMetersPerPx().toFixed(2)}
          <br />
          Feet/Pixel {getFeetPerPx().toFixed(2)}
          <br />
          <button onClick={zoomIn} disabled={zoomLevel === 22}>
            + Zoom In
          </button>
          <button onClick={zoomOut} disabled={zoomLevel === 2}>
            - Zoom Out
          </button>
        </div>
      </MapControl>
      <MapHandler place={selectedPlace} marker={marker} />
    </APIProvider>
  );
};

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div style={{ padding: 5 }}>
      <input ref={inputRef} />
    </div>
  );
};

export default GoogleMap;
