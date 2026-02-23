const API_KEY = process.env.GOOGLE_MAPS_API_KEY_geocoding;

async function geocode(address) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );
  if (!response.ok) return null;
  return response.json();
}

async function getCoordsForAddress(address, req, res, next) {
  try {
    if (!address || typeof address !== "string" || !address.trim()) {
      res.status(404);
      throw new Error(req.t("location.couldNotGetLocation"));
    }

    let data = await geocode(address.trim());

    if (!data || data.status !== "OK") {
      const fallback = address.trim().includes(",") ? null : `${address.trim()}, Warsaw, Poland`;
      if (fallback) {
        data = await geocode(fallback);
      }
    }

    if (!data || data.status !== "OK") {
      const apiMessage = data?.error_message || data?.status || "Unknown";
      console.warn("Geocode API failed:", { status: data?.status, error_message: apiMessage, address });
      res.status(404);
      throw new Error(req.t("location.couldNotGetLocation"));
    }

    const firstResult = data.results?.[0];
    if (!firstResult?.geometry?.location) {
      console.warn("Geocode API: no geometry in results", { address });
      res.status(404);
      throw new Error(req.t("location.couldNotGetLocation"));
    }
    const coordinates = firstResult.geometry.location;

    return coordinates;
  } catch (err) {
    console.log("err:", err);
    next(err);
  }
}

export default getCoordsForAddress;
