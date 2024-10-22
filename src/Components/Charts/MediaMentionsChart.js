import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const MediaMentionsChart = (props) => {
  const [activeFilter, setActiveFilter] = useState("UAE");
  const [sentimentData, setSentimentData] = useState(props.sentimentData);

  useEffect(() => {
    setActiveFilter(props.activeFilter);
    setSentimentData(props.sentimentData);
  }, [props.activeFilter, props.sentimentData]);

  const [chartData, setChartData] = useState({
    series: [{
      name: 'Volume',
      data: []
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: { show: false },
        events: {
          click: (event, chartContext, config) => {
            window.scrollTo({ left: 0, top: 3000, behavior: 'smooth' });
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 5,
          dataLabels: {
            position: 'top',
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
        labels: {
          show: true,
          formatter: function (val, index) {
            const date = new Date(index);
            const currentDate = new Date();
            const day = date.getDate();
            const skipDays = props.activeMenu === 30 ? 2 : 5;
            const currentDiv = currentDate.getDay() % skipDays;
            if (day % skipDays === currentDiv) {
              return date.getMonth() + 1 + "/" + day;
            }
            return '';
          },
          style: {
            fontSize: '12px',
            colors: ["#000000"],
            fontFamily: 'Arial'
          }
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: { enabled: true }
      },
      yaxis: {
        title: { text: 'Volume' },
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: true }
      },
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          // Access the updated sentiment data
          const item = props.sentimentData[dataPointIndex];
          console.log(sentimentData);
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
      title: {
        text: 'Media Mentions ' + "of " + activeFilter,
        align: 'left',
        style: { fontSize: '15px' }
      }
    }
  });

  useEffect(() => {
    if (props.sentimentData) {
      const data = props.sentimentData;
      const volumes = data.map(item => item?.volume);
      const categories = data.map(item => new Date(item?.pubdate).toLocaleDateString());

      setChartData(prevData => ({
        ...prevData,
        series: [{ name: 'Volume', data: volumes }],
        options: {
          ...prevData.options,
          title: {
            text: 'Media Mentions ' + "of " + props.activeFilter,
            align: 'left',
            style: { fontSize: '16px' }
          },
          tooltip: {
            enabled: true,
            custom: ({ series, seriesIndex, dataPointIndex }) => {
              // Access the updated sentiment data
              const item = props.sentimentData[dataPointIndex];
              console.log(sentimentData);
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
          xaxis: { ...prevData.options.xaxis, categories: categories }
        }
      }));
    }
  }, [props.sentimentData]);

  return (
    <div>
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default MediaMentionsChart;
