import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from 'react-apexcharts';

const MultiAxisLineChart = (props) => {
  const [chartData, setChartData] = useState([{ data: [] }]);
  const [options, setOptions] = useState({
    xaxis: {
      type: 'datetime'
    },
  });
  const sentimentData = useRef();

  const skipDays = (dates, skip) => {
    return dates.map((date, index) => (index % skip === 0 ? date : ""));
  };

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

  useEffect(() => {
    if (!props.sentimentData || !props.sentimentData.length) return;

    const trustScores = props.sentimentData.map((item) => (item.trusted * 100).toFixed(2));
    const allDates = generateDates(props.activeMenu);
    const skippedDates = props.activeMenu === 90 ? skipDays(allDates, 5) : skipDays(allDates, 2);

    setChartData(getSentimentOverTime(props.sentimentData));
    sentimentData.current = props.sentimentData;
    // Update the options while preserving the existing configuration
    setOptions((prevOptions) => ({
      ...prevOptions,

      chart: {
        type: 'line',
        height: 350,
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight', width: 3 },
      markers: {
        size: 4,
        strokeColors: ['rgb(0, 200, 0)', 'rgb(240, 240, 0)', 'rgb(200, 0, 0)'],
        hover: { size: 5, strokeColors: 'rgb(100, 100, 100)' },
      },
      title: { text: 'Sentiment in ' + props.activeFilter, align: 'left' },
      colors: ['rgb(0, 200, 0)', 'rgb(240, 240, 0)', 'rgb(200, 0, 0)'],
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      yaxis: {
        title: { text: 'Volume' },
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: true },
      },
      tooltip: {
        enabled: true,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const item = sentimentData.current[dataPointIndex];
          const positive = item?.volume_pos;
          const negative = item?.volume_neg;
          const neutral = item?.volume_neu;
          const volume = item?.volume;
          const date = item?.pubdate;

          let sentimentText;
          if (item?.sentiment < -4) sentimentText = 'Very Negative';
          else if (item?.sentiment < 0) sentimentText = 'Negative';
          else if (item?.sentiment === 0) sentimentText = 'Neutral';
          else if (item?.sentiment > 0 && item?.sentiment <= 4) sentimentText = 'Positive';
          else if (item?.sentiment > 4) sentimentText = 'Very Positive';

          return `
            <div style="padding: 10px; border-radius: 5px; background-color: white; border: 1px solid #ddd;">
              <p><strong>Date: ${date}</strong></p>
              <p>Volume: ${volume}</p>
              <p>Positive: ${positive}</p>
              <p>Negative: ${negative}</p>
              <p>Neutral: ${neutral}</p>
              <p style="color: ${sentimentText?.includes('Positive') ? 'green' : 'red'};">Sentiment: ${sentimentText}</p>
            </div>`;
        },
      },
    }));
  }, [props]);

  const getSentimentOverTime = (data) => {
    if (!data) return { datasets: [] };
    return [
      { name: 'Volume', data: data.map((item) => ({ x: item?.pubdate, y: item?.volume_pos })) },
      { name: 'Neutral', data: data.map((item) => ({ x: item?.pubdate, y: item?.volume_neu })) },
      { name: 'Negative', data: data.map((item) => ({ x: item?.pubdate, y: item?.volume_neg })) },
    ];
  };

  return (
    <div>
      <ReactApexChart options={options} series={chartData} type="line" height={350} />
    </div>
  );
};

export default MultiAxisLineChart;
