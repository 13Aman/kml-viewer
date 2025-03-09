import { useState } from "react";
import * as toGeoJSON from "@mapbox/togeojson";

export default function KMLUploader({ onKMLParsed, onClearData }) {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    // Clear previous data when a new file is selected
    if (onClearData) {
      onClearData();
    }
    
    if (!file) {
      setFileName("");
      return;
    }

    setFileName(file.name);
    processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parser = new DOMParser();
        const kml = parser.parseFromString(e.target.result, "text/xml");
        const geoJson = toGeoJSON.kml(kml);
        onKMLParsed(geoJson);
      } catch (error) {
        console.error("Error parsing KML:", error);
        alert("Failed to parse KML file. Please check the file format.");
      }
    };
    
    reader.onerror = () => {
      console.error("Error reading file");
      alert("Error reading file. Please try again.");
    };
    
    reader.readAsText(file);
  };

  const handleClearFile = () => {
    setFileName("");
    if (onClearData) {
      onClearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.kml')) {
        setFileName(file.name);
        if (onClearData) {
          onClearData();
        }
        processFile(file);
      } else {
        alert("Please upload a KML file");
      }
    }
  };

  return (
    <div className="kml-uploader">
      <div className="form-group">
        <label htmlFor="kml-file" className="form-label">
          Select KML file to visualize
        </label>
        
        <div 
          className={`file-drop-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="file-upload-content">
            <div className="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="file-message">
              {fileName ? 
                <span className="file-name-display">{fileName}</span> : 
                <span>Drag and drop your KML file here or click to browse</span>
              }
            </div>
            <input
              type="file"
              id="kml-file"
              accept=".kml"
              onChange={handleFileUpload}
              className="file-input"
            />
            <button className="btn browse-btn">Browse Files</button>
          </div>
        </div>
        
        {fileName && (
          <div className="file-actions mt-20">
            <button 
              className="btn btn-outline btn-sm" 
              onClick={handleClearFile}
            >
              Clear File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}