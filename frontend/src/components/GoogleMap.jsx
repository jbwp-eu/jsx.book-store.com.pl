import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import Message from "./Message";
import { useSelector } from "react-redux";

const GoogleMap = () => {
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState("");
  const { language } = useSelector((state) => state.ui);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || "";
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() || "undefined";

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

  if (!apiKey) {
    return (
      <div className="google">
        <Message variant="danger">
          {language === "EN"
            ? "Map is unavailable. Please configure VITE_GOOGLE_MAPS_API_KEY."
            : "Mapa jest niedostępna. Skonfiguruj VITE_GOOGLE_MAPS_API_KEY."}
        </Message>
      </div>
    );
  }

  return (
    <div className="google">
      {hasValidCoordinates ? (
        <APIProvider apiKey={apiKey}>
          <Map
            mapId={mapId}
            defaultZoom={15}
            defaultCenter={coordinates ?? { lat: 0, lng: 0 }}
            gestureHandling={"cooperative"}
            disableDefaultUI={false}
            style={{ width: "100%", height: "100%" }}
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
