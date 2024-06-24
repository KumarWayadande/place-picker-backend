import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import fetchAvailablePlaces from "../http.js";
import useFetch from "../hooks/useFetch.jsx";

const fetchSortedPlaces = async () => {
  const places = await fetchAvailablePlaces();
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { coords } = position;
      const { latitude, longitude } = coords;
      const sortedPlaces = sortPlacesByDistance(places, latitude, longitude);
      resolve(sortedPlaces);
    });
  });
};

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    error,
    fetchedData: availablePlaces,
    isFetching,
  } = useFetch(fetchSortedPlaces, []);

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
