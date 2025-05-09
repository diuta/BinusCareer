import "leaflet/dist/leaflet.css";

import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const formatValue = (value) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
          maximumFractionDigits: 0,
        }).format(value)
      ?? value.toString();
  }
  return value;
};

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function ByDomicile({ alumniData }) {
  const center: LatLngExpression = [-2.5489, 118.0149];

  const bounds: LatLngBoundsExpression = [
    [-90, -180],
    [90, 180],
  ];

  const countries = [
    ...new Set(alumniData.map((location) => location.countryName)),
  ];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      maxZoom={20}
      minZoom={3}
      maxBounds={bounds} 
      maxBoundsViscosity={1}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {countries.map((country) =>
        alumniData
          .filter((location) => location.countryName === country)
          .map((location) => {
            const position: LatLngExpression =
              location.cityName && location.provinceName
                ? [location.cityLat, location.cityLong]
                : [location.countryLat, location.countryLong];

            return (
              <Marker
                key={`${location.countryName}-${location.cityName}-${location.cityLat}-${location.cityLong}`}
                position={position}
              >
                <Popup>
                  <div>
                    <strong>Country:</strong> {location.countryName}
                    <br />
                    {location.cityName && location.provinceName ? (
                      <>
                        <strong>Province:</strong> {location.provinceName}
                        <br />
                        <strong>City:</strong> {location.cityName}
                        <br />
                      </>
                    ) : null}
                    <strong>Total Alumni:</strong> {formatValue(location.totalAlumni)}
                  </div>
                </Popup>
              </Marker>
            );
          })
      )}
    </MapContainer>
  );
}

ByDomicile.propTypes = {
  alumniData: PropTypes.arrayOf(
    PropTypes.shape({
      countryName: PropTypes.string.isRequired,
      provinceName: PropTypes.string,
      cityName: PropTypes.string,
      totalAlumni: PropTypes.number.isRequired,
      countryLat: PropTypes.number.isRequired,
      countryLong: PropTypes.number.isRequired,
      provLat: PropTypes.number,
      provLong: PropTypes.number,
    })
  ).isRequired,
};

export default ByDomicile;
