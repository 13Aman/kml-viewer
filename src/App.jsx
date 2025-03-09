import './App.css';
import { useState } from "react";
import KMLUploader from "./KMLUploader";
import MapComponent from "./MapComponent";
import SummaryTable from "./SummaryTable";
import DetailedTable from "./DetailedTable";

export default function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleClearData = () => {
    setGeoJsonData(null);
    setShowSummary(false);
    setShowDetails(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">KML Data Visualizer</h1>
      </header>
      
      <div className="row">
        <div className="col">
          <div className="card">
            <h2 className="card-title">Upload KML File</h2>
            <KMLUploader 
              onKMLParsed={setGeoJsonData} 
              onClearData={handleClearData}
            />
          </div>
        </div>
      </div>
      
      <div className="col">
        {geoJsonData && (
          <div className="card">
            <h2 className="card-title">Map Visualization</h2>
            <MapComponent geoJsonData={geoJsonData} />
          </div>
        )}
      </div>

      {geoJsonData && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Data Summary</h2>
            <button 
              className={`btn ${showSummary ? 'btn-primary' : 'btn-outline'}`} 
              onClick={() => setShowSummary(!showSummary)}
            >
              {showSummary ? 'Hide Summary' : 'Show Summary'}
            </button>
          </div>
          {showSummary && <SummaryTable geoJsonData={geoJsonData} />}
        </div>
      )}
      
      {geoJsonData && (
        <div className="card mt-20">
          <div className="card-header">
            <h2 className="card-title">Detailed Information</h2>
            <button 
              className={`btn ${showDetails ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          {showDetails && <DetailedTable geoJsonData={geoJsonData} />}
        </div>
      )}
    </div>
  );
}