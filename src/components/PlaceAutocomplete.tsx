import { FC, useState, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete: FC<PlaceAutocompleteProps> = ({
  onPlaceSelect,
}: PlaceAutocompleteProps) => {
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
    <input
      style={{
        minWidth: 300,
        borderRadius: 8,
        padding: 8,
        fontSize: 15,
        border: "solid 2px #ccc",
      }}
      placeholder="Find Address..."
      type="search"
      ref={inputRef}
    />
  );
};

export default PlaceAutocomplete;
