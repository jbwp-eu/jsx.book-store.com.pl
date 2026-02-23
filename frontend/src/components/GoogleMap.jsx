import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { useEffect } from "react";
import Message from "./Message";
import { useSelector } from "react-redux";

// const coordinates = { lat: 52.24778, lng: 21.01526 };

const GoogleMap = () => {
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");
  const { language } = useSelector((state) => state.ui);

  useEffect(() => {
    const getCoordinates = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/contact?language=${language}`
      );
      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        setError(responseData.message || "Failed to load location");
        setCoordinates(null);
        return;
      }
      const responseData = await response.json();
      const loc = responseData.location;
      // Expect { lat, lng }; guard against malformed or Place-like shape
      const normalized =
        loc && typeof loc.lat === "number" && typeof loc.lng === "number"
          ? { lat: loc.lat, lng: loc.lng }
          : loc?.geometry?.location
            ? { lat: loc.geometry.location.lat, lng: loc.geometry.location.lng }
            : null;
      setCoordinates(normalized);
      if (normalized) {
        setError("");
      } else {
        setError("Invalid location data");
      }
    };
    getCoordinates();
  }, [language]);

  const hasValidCoordinates =
    coordinates &&
    typeof coordinates.lat === "number" &&
    typeof coordinates.lng === "number";

  return (
    <div className="google">
      {hasValidCoordinates ? (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY_maps}>
          <Map
            mapId={"4504f8b37365c3d0"}
            defaultZoom={10}
            defaultCenter={coordinates ?? { lat: 0, lng: 0 }}
            gestureHandling={"cooperative"}
            disableDefaultUI={false}
          >
            <AdvancedMarker
              position={coordinates ?? { lat: 0, lng: 0 }}
              onClick={() => setOpen(true)}
            >
              <div
                className="custom-marker-pin"
                aria-hidden
              />
            </AdvancedMarker>
            {open && (
              <InfoWindow
                position={coordinates ?? { lat: 0, lng: 0 }}
                onCloseClick={() => setOpen(false)}
              >
                Warsaw
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      ) : (
        <Message variant="danger">{error}</Message>
      )}
    </div>
  );
};

export default GoogleMap;
