import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const MultiAxisLineChart = (props) => {
  const generateDates = (days) => {
    const dates = [];
    const currentDate = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      dates.push(formattedDate);
    }
    return dates;
  };

  const skipDays = (dates, skip) => {
    return dates.map((date, index) => (index % skip === 0 ? date : ""));
  };

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Trust Score",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        events: {
          click: (event, chartContext, config) => {
            window.scrollTo({ left: 0, top: 3000, behavior: "smooth" });
          },
        },
        toolbar: {
          show: false, // Disable the toolbar
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Trustworthy News Score" + " of " + props.activeFilter,
        align: "left",
        style: {
          fontSize: "16px",
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          fontWeight: "bold",
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "14px",
            fontFamily: "Arial",
          },
        },
      },
      yaxis: {
        min: 40,
        max: 90,
        title: {
          text: "Percentage %",
          style: {
            fontSize: "14px",
            fontFamily: "Helvetica",
          },
        },
        labels: {
          style: {
            fontSize: "14px",
            fontFamily: "Arial",
          },
        },
      },
      tooltip: {
        enabled: true,
        // shared: false,
        // intersect: true, // Show tooltip only for the hovered point
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const item = props.sentimentData[dataPointIndex]; // Getting the data for the current data point
          // Extract positive, negative, neutral volumes
          const positive = item?.volume_pos;
          const negative = item?.volume_neg;
          const neutral = item?.volume_neu;
          const volume = item?.volume;
          const date = item?.pubdate;

          // Determine sentiment based on the provided logic
          let sentimentText;
          if (item?.sentiment < -4) {
            sentimentText = 'Very Negative';
          } else if (item?.sentiment < 0) {
            sentimentText = 'Negative';
          } else if (item?.sentiment === 0) {
            sentimentText = 'Neutral';
          } else if (item?.sentiment > 0 && item?.sentiment <= 4) {
            sentimentText = 'Positive';
          } else if (item?.sentiment > 4) {
            sentimentText = 'Very Positive';
          }

          return `
            <div style="padding: 10px; border-radius: 5px; background-color: white; border: 1px solid #ddd;">
              <p><strong>Date: ${date}</strong></p>
              <p>Volume: ${volume}</p>
              <p>Positive: ${positive}</p>
              <p>Negative: ${negative}</p>
              <p>Neutral: ${neutral}</p>
              <p style="color: ${sentimentText?.includes('Positive') ? 'green' : 'red'};">Sentiment: ${sentimentText}</p>
            </div>`;
        }
      },
      
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "14px",
        fontFamily: "Arial",
      },
    },
  });

  useEffect(() => {
    if (props.sentimentData) {
      const trustScores = props.sentimentData.map((item) =>
        (item.trusted * 100).toFixed(2)
      );
      const allDates = generateDates(props.activeMenu);
      const skippedDates =
        props.activeMenu === 90
          ? skipDays(allDates, 5)
          : skipDays(allDates, 2);

      setChartData({
        series: [
          {
            name: "Trust Score",
            data: trustScores,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: { ...chartData.options.xaxis, categories: skippedDates },
          tooltip: {
            enabled: true,
            custom: ({ series, seriesIndex, dataPointIndex }) => {
              // Access the updated sentiment data
              const item = props.sentimentData[dataPointIndex];
              const volume = series[seriesIndex][dataPointIndex];

              const positive = item?.volume_pos;
              const negative = item?.volume_neg;
              const neutral = item?.volume_neu;
              const date = item?.pubdate;
              let sentimentText;

              if (item?.sentiment < -4) {
                sentimentText = 'Very Negative';
              } else if (item?.sentiment < 0) {
                sentimentText = 'Negative';
              } else if (item?.sentiment === 0) {
                sentimentText = 'Neutral';
              } else if (item?.sentiment > 0 && item?.sentiment <= 4) {
                sentimentText = 'Positive';
              } else if (item?.sentiment > 4) {
                sentimentText = 'Very Positive';
              }

              return `
                <div style="padding: 10px; border-radius: 5px; background-color: white; border: 1px solid #ddd;">
                  <p><strong>Date: ${date}</strong></p>
                  <p>Volume: ${volume}</p>
                  <p>Positive: ${positive}</p>
                  <p>Negative: ${negative}</p>
                  <p>Neutral: ${neutral}</p>
                  <p style="color: ${sentimentText?.includes('Positive') ? 'green' : 'red'};">Sentiment: ${sentimentText}</p>
                </div>`;
            }
          },
        },
      });
    }
  }, [props.sentimentData, props.activeMenu]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default MultiAxisLineChart;
