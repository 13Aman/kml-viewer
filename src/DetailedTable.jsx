export default function DetailedTable({ geoJsonData }) {
    if (!geoJsonData) return null;

    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
    };
  
  
    const details = geoJsonData.features.reduce((acc, feature) => {
      const type = feature.geometry.type;
      let length = 0;
      console.log(type);
  
      if (type === "LineString") {
        length = haversineDistance(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
      } else if (type === "MultiLineString") {
        feature.geometry.coordinates.forEach((line) => {
            for (let i = 1; i < line.length; i++) {
              length += haversineDistance(line[i - 1], line[i]);
            }
          });
      }
  
      if (length > 0) {
        acc.push({ type, length: length.toFixed(2) });
      }
  
      return acc;
    }, []);
  
    return (
      <table border="1">
        <thead>
          <tr>
            <th>Element Type</th>
            <th>Total Length</th>
          </tr>
        </thead>
        <tbody>
          {details.map(({ type, length }, index) => (
            <tr key={index}>
              <td>{type}</td>
              <td>{length} km</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }