import React from "react";
import { useCarbonFootprint } from "react-carbon-footprint";

const CarbonFootprintDisplay = () => {
  const footprint = useCarbonFootprint();

  // Package theke pawa values handle kora
  const gCO2 = footprint?.gCO2 || footprint?.[0] || 0;
  const bytesTransferred = footprint?.bytesTransferred || footprint?.[1] || 0;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "rgba(255, 255, 255, 0.95)",
        padding: "12px 16px",
        borderRadius: "8px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #ddd",
        color: "#333",
      }}
    >
      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "bold" }}>
        Network Carbon Footprint
      </h4>
      <p style={{ margin: "2px 0", fontSize: "13px" }}>
        Bytes Transferred: <strong>{bytesTransferred}</strong> bytes
      </p>
      <p style={{ margin: "2px 0", fontSize: "13px" }}>
        CO2 Emissions: <strong>{Number(gCO2).toFixed(4)}</strong> gCO2eq
      </p>
      <p style={{ margin: "6px 0 0 0", fontSize: "10px", color: "#666" }}>
        Estimates based on network data transfer during this session
      </p>
    </div>
  );
};

export default CarbonFootprintDisplay;
