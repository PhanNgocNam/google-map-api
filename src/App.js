/*global google*/
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

// const center = { lat: 10.822024, lng: 106.687569 };
function App() {
  const center = useRef();
  center.current = { lat: 10.822024, lng: 106.687569 };
  const originRef = useRef();
  const destinationRef = useRef();
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionRespone, setDirectionRespone] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "",
    libraries: ["places"],
  });

  const getRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionRespone(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  return (
    <div className="App">
      {isLoaded ? (
        <>
          <GoogleMap
            center={center.current}
            zoom={16}
            mapContainerStyle={{ width: "100%", height: "100vh" }}
            options={{ mapTypeControl: false, streetViewControl: false }}
            onLoad={(map) => {
              setMap(map);
            }}
            onClick={(ev) => {
              console.log(ev.latLng.lat(), ev.latLng.lng());
            }}
          >
            {/* Display maker $ directions */}
            <Marker position={center.current} />
            {directionRespone && (
              <DirectionsRenderer directions={directionRespone} />
            )}
          </GoogleMap>

          <div className="addOrder">
            <Autocomplete>
              <input
                className="input"
                placeholder="Origin..."
                ref={originRef}
              />
            </Autocomplete>

            <Autocomplete>
              <input
                className="input"
                placeholder="Destination..."
                ref={destinationRef}
              />
            </Autocomplete>

            <div>
              <button onClick={getRoute}>Caculate directions</button>
              <button>Cancel</button>
            </div>

            <div>
              <h3>Distance: {distance}</h3>
              <h3>Duration: {duration}</h3>
            </div>

            <button
              className="getBackCurrentPosition"
              onClick={() => {
                map.panTo(center.current);
                map.setZoom(16);
              }}
            >
              (-o-)
            </button>
          </div>
        </>
      ) : (
        <h1>In process...</h1>
      )}
    </div>
  );
}

export default App;
