import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { feature } from "topojson-client";
import { Tooltip } from "react-tooltip"; // Import Tooltip
import iso from "iso-3166-1"; // Correct import for iso-3166-1
import 'react-tooltip/dist/react-tooltip.css'; // Import Tooltip CSS

// A sample world map TopoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Adjusting the color scale to match the colors in the image
const colorScale = (sentiment) => {
  if (sentiment > 0) return "#56B94E"; // Positive sentiment
  if (sentiment === 0) return "#FFAD00"; // Neutral sentiment
  if (sentiment < 0) return "red"; // Negative sentiment
  return "black"; // No data (No Mention)
};

// Function to return the correct sentiment label and color
const getSentimentLabel = (sentiment) => {
  if (sentiment < -4) return { label: "Very Negative", color: "red" };
  if (sentiment < 0) return { label: "Negative", color: "red" };
  if (sentiment === 0) return { label: "Neutral", color: "#FFAD00" };
  if (sentiment > 0 && sentiment <= 4) return { label: "Positive", color: "#56B94E" };
  if (sentiment > 4) return { label: "Very Positive", color: "#56B94E" };
  return { label: "No Data", color: "black" };
};

const WorldMap = ({ countryData }) => {
  const [geographies, setGeographies] = useState([]);
  const [mapData, setMapData] = useState({});

  // Convert TopoJSON to GeoJSON and extract geographies
  useEffect(() => {
    fetch(geoUrl)
      .then((response) => response.json())
      .then((worldData) => {
        const geoJson = feature(worldData, worldData.objects.countries).features; // Convert TopoJSON to GeoJSON
        setGeographies(geoJson); // Set the geographies for the map
      });
  }, []);

  // Map API data to a format for easier access
  useEffect(() => {
    const countryMap = countryData.reduce((acc, item) => {
      acc[item.country] = item; // Use ISO 2-letter country codes as keys
      return acc;
    }, {});
    setMapData(countryMap); // Store the mapped country data
  }, [countryData]);

  return (
    <div>
      <ComposableMap>
        <Geographies geography={geographies}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const numericCode = geo.id; // Numeric country code from TopoJSON
              const isoCode = iso.whereNumeric(numericCode)?.alpha2; // Map numeric code to ISO Alpha-2 code
              const countryInfo = mapData[isoCode]; // Find the country in the API data using ISO code
              const sentiment = countryInfo ? countryInfo.sentiment : null; // Get the sentiment for that country
              const volume = countryInfo ? countryInfo.volume : "No Data"; // Get the volume for that country
              
              // Get the sentiment label and color based on the sentiment value
              const sentimentInfo = sentiment !== null ? getSentimentLabel(sentiment) : { label: "No Data", color: "black" };

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={sentiment !== null ? colorScale(sentiment) : "black"} // Default to black for countries with no data
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#F53", outline: "none" },
                    pressed: { fill: "#E42", outline: "none" },
                  }}
                  data-tooltip-id="my-tooltip" // Tooltip id reference
                  data-tooltip-html={`
                    <div>
                      <strong>Country:</strong> ${geo.properties.name}<br />
                      <strong>Volume:</strong> ${volume}<br />
                      <strong>Sentiment:</strong> <span style="color:${sentimentInfo.color};">${sentimentInfo.label}</span><br />
                    </div>
                  `}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip element */}
      <Tooltip id="my-tooltip" place="top" className="custom-tooltip" />
    </div>
  );
};

export default WorldMap;