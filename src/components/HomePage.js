// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { startTransition } from 'react';
import { Chart } from "react-google-charts";

export default function HomePage({ summary }) {

  const [data, setData] = useState(null);

  const [options, setOptions] = useState({
    title: "Avearage distance and speed over time",
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: {
      title: "Date",
      format: "MMM d", // Custom date format      
      //gridlines: { count: 3 }, // Controls the number of gridlines
    },
  });

  const [dataOptions, setDataOptions] = useState(null);

  useEffect(() => {
    if (summary === null || dataOptions !== null) return;

    const startDate = new Date(summary.minDate);
    const endDate = new Date(summary.maxDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.round((endDate - startDate) / oneDay);

    if (daysDiff > 100) {
      startDate.setDate(startDate.getDate() + daysDiff - 100);
    }

    setDataOptions({
      startDate: startDate,
      endDate: endDate,
      rollingDays: 30
    });

  }, [summary]);

  useEffect(() => {
    if (dataOptions === null) return;

    const worker = new Worker(new URL("../scripts/workers/summarizeRuns.js", import.meta.url));

    worker.onmessage = (e) => {
      setData(e.data);
    };

    worker.postMessage(dataOptions);

    return () => worker.terminate();

  }, [dataOptions]);

  const toInputDate = (date) =>
    date.toISOString().split("T")[0];

  const formatStartDate = (e) => {
    e.persist();
    setDataOptions(prev => ({ ...prev, startDate: new Date(e.target.value) }));
  }

  const formatEndDate = (e) => {
    e.persist();
    setDataOptions(prev => ({ ...prev, endDate: new Date(e.target.value) }));
  }

  const formatRollingDays = (e) => {
    e.persist();
    setDataOptions(prev => ({ ...prev, rollingDays: Math.max(1, parseInt(e.target.value) || 0) }));
  }

  return (
    <div>
      <h1>Summary</h1>

      {summary && (
        <div>
          <p>Total runs: {summary.totalRuns}</p>
          <p>Earliest run: {summary.minDate ? summary.minDate : 'N/A'}</p>
          <p>Latest run: {summary.maxDate ? summary.maxDate : 'N/A'}</p>
        </div>
      )}

      {data && (
        <div>
          <label htmlFor="startDate">Start date</label>
          <input type="date" id="startDate" value={toInputDate(dataOptions.startDate)} onChange={e => formatStartDate(e)} />

          <label htmlFor="endDate">End date</label>
          <input type='date' id='endDate' name='endDate' value={toInputDate(dataOptions.endDate)} onChange={e => formatEndDate(e)} />

          <label htmlFor="rollingDays">Rolling Days</label>
          <input type='number' id='rollingDays' name='rollingDays' value={dataOptions.rollingDays} onChange={e => formatRollingDays(e)} />
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
            formatters={[
              {
                column: 0,
                type: "DateFormat",
                options: {
                  timeZone: 0,
                },
              },
            ]}
          />
        </div>
      )}


    </div>


  );
}
