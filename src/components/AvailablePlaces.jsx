import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import fetchAvailablePlaces from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const fetchedPlaces = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const { coords } = position;
          const { latitude, longitude } = coords;
          console.log(latitude, longitude);
          const sortedPlaces = sortPlacesByDistance(
            fetchedPlaces,
            latitude,
            longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch the data, try again later...",
        });
      }
    }
    fetchPlaces();
  }, []);

  if (error) return <Error title="An Error occured" message={error.message} />;

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      loadingText="Fetching place data..."
      isLoading={isFetching}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
