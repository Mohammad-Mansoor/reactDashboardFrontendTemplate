import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

const AfghanistanProvincesMap = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      zoomOnScroll={false}
      zoomAnimate={true}
      zoomMax={12}
      zoomMin={1}
      zoomStep={1.5}
      focusOn={{
        region: "AF",
        animate: true,
        scale: 5,
        x: 0.5,
        y: 0.5,
      }}
      selectedRegions={["AF"]}
      regionStyle={{
        initial: {
          fill: mapColor || "#20988E",
          fillOpacity: 0,
          stroke: "none",
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#20988E",
        },
        selected: {
          fill: "#20988E",
        },
      }}
      regionLabelStyle={{
        initial: {
          fill: "#20988E",
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
      }}
      markers={[
        {
          latLng: [36.7361, 69.5345],
          name: "Takhar",
          style: {
            fill: "#CD0202",
            stroke: "white",
            strokeWidth: 1,
          },
        },
        {
          latLng: [37.1287, 70.5780],
          name: "Badakhshan",
          style: {
            fill: "#20988E",
            stroke: "white",
            strokeWidth: 1,
          },
        },
        {
          latLng: [36.1307, 68.7083],
          name: "Baghlan",
          style: {
            fill: "#FF5733",
            stroke: "white",
            strokeWidth: 1,
          },
        },
        {
          latLng: [36.7280, 68.8681],
          name: "Kunduz",
          style: {
            fill: "#C6DA89",
            stroke: "white",
            strokeWidth: 1,
          },
        },
      ]}
      markerStyle={{
        initial: {
          fill: "#20988E",
          r: 4,
        },
      }}
    />
  );
};

export default AfghanistanProvincesMap;