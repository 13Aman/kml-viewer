import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to fit map to GeoJSON bounds
function FitBounds({ geoJsonData }) {
  const map = useMap();
  
  useEffect(() => {
    if (geoJsonData && geoJsonData.features.length > 0) {
      try {
        const geoJsonLayer = L.geoJSON(geoJsonData);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }
  }, [geoJsonData, map]);
  
  return null;
}

export default function MapComponent({ geoJsonData }) {
  const geoJsonLayerRef = useRef(null);
  
  // Style function for GeoJSON features
  const styleFeature = (feature) => {
    switch (feature.geometry.type) {
      case 'LineString':
      case 'MultiLineString':
        return {
          color: '#3388ff',
          weight: 3,
          opacity: 0.7
        };
      case 'Polygon':
      case 'MultiPolygon':
        return {
          color: '#3388ff',
          fillColor: '#3388ff',
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.4
        };
      default:
        return {
          color: '#3388ff',
          weight: 3
        };
    }
  };
  
  // Function to handle each feature and add popups
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const popupContent = `
        <div class="feature-popup">
          <h3>${feature.properties.name || 'Unnamed Feature'}</h3>
          ${feature.properties.description ? `<p>${feature.properties.description}</p>` : ''}
          <p><strong>Type:</strong> ${feature.geometry.type}</p>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };
  
  // Extract point markers from GeoJSON
  const markers = geoJsonData ? geoJsonData.features
    .filter(feature => feature.geometry.type === 'Point')
    .map((feature, index) => {
      const coordinates = feature.geometry.coordinates;
      return (
        <Marker 
          key={`marker-${index}`} 
          position={[coordinates[1], coordinates[0]]}
        >
          <Popup>
            <div className="marker-popup">
              <h3>{feature.properties?.name || 'Unnamed Point'}</h3>
              {feature.properties?.description && <p>{feature.properties.description}</p>}
            </div>
          </Popup>
        </Marker>
      );
    }) : [];
  
  return (
    <div className="map-component">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: "500px", width: "100%" }}
        className="map-container"
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData}
            style={styleFeature}
            onEachFeature={onEachFeature}
            ref={geoJsonLayerRef}
          />
        )}
        
        {/* Render individual markers for Point features */}
        {markers}
        
        {/* Fit map to bounds */}
        <FitBounds geoJsonData={geoJsonData} />
      </MapContainer>
      
      <div className="map-legend mt-20">
        <h3>Map Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: '#3388ff', borderRadius: '50%' }}></span>
            <span>Point</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: '#3388ff', height: '3px' }}></span>
            <span>Line</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: 'rgba(51, 136, 255, 0.4)', border: '2px solid #3388ff' }}></span>
            <span>Polygon</span>
          </div>
        </div>
      </div>
    </div>
  );
}