export default function SummaryTable({ geoJsonData }) {
    if (!geoJsonData) return null;
  
    const elementCount = geoJsonData.features.reduce((acc, feature) => {
      const type = feature.geometry.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  
    return (
      <table border="1">
        <thead>
          <tr>
            <th>Element Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(elementCount).map(([type, count]) => (
            <tr key={type}>
              <td>{type}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }