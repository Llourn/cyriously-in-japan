/*global google*/
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

const GoogleMap = ({ setLocation, currentLocation }) => {
  const map = useRef();
  const mapInput = useRef();

  let manualMarkers = [];
  let searchMarkers = [];

  const startingMapPosition = {
    lat: currentLocation?.lat || 35.67,
    lng: currentLocation?.lng || 139.75
  }

  const loader = new Loader({
    apiKey: process.env.REACT_APP_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });

  useEffect(() => {
    loader.load().then(() => {
      const newMap = new google.maps.Map(map.current, {
        center: startingMapPosition,
        zoom: 8,
        mapTypeId: "roadmap",
        gestureHandling: "cooperative",
      });
      console.log(currentLocation)
      if(currentLocation) {
        const startingLocation = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
        placeMarkerAndPanTo(startingLocation, newMap);
      }

      newMap.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, newMap);
      });

      function placeMarkerAndPanTo(latLng, map) {
        clearAllMarkers();
        const newMarker = new google.maps.Marker({
          position: latLng,
          draggable: true,
          map: map,
        });
        manualMarkers.push(newMarker);
        const pos = newMarker.getPosition();
        setLocation({lat: pos.lat, lng: pos.lng});
        map.panTo(latLng);
      }

      function clearAllMarkers() {
        clearManualMarkers();
        clearSearchMarkers();
      }

      function clearManualMarkers() {
        manualMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        setLocation(null);
        manualMarkers = [];
      }

      function clearSearchMarkers() {
        searchMarkers.forEach((marker) => {
          marker.setMap(null);
        });
        searchMarkers = [];
      }

      const searchBox = new google.maps.places.SearchBox(mapInput.current);

      newMap.addListener("bounds_changed", () => {
        searchBox.setBounds(newMap.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        clearAllMarkers();

        // For each place, get the icon, name and location
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry.");
            return;
          }

          // Create a marker for each place.
          const newMark = new google.maps.Marker({
            map: newMap,
            title: place.name,
            position: place.geometry.location,
          });

          newMark.addListener("click", () => {
            newMap.panTo(newMark.getPosition());
            clearSearchMarkers();
            placeMarkerAndPanTo(newMark.getPosition(), newMap);
          });
          if (places.length > 1) {
            searchMarkers.push(newMark);
          } else {
            manualMarkers.push(newMark);
            setLocation(newMark.getPosition());
          }

          if (place.geometry.viewport) {
            // only geoocodes have viewport
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        newMap.fitBounds(bounds);
      });
    });
  }, []);

  return (
    <>
      <input type="text" ref={mapInput} />
      <div ref={map} style={{ height: "400px", width: "100%" }}></div>
    </>
  );
};

export default GoogleMap;
