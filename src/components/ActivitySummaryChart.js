import React, { useState } from 'react';
import { Chart } from "react-google-charts";

function ActivitySummaryChart({ lineChartData, viewWindow, handleRollingRangeChanged, handleTimeframeChanged }) {

  let id_prefix = 'timeframe_';
  const timeframes = ['Month', '3 Months', 'Year'];
  const timeframes_radio_buttons = timeframes.map((tf, index) =>

    <span key={id_prefix + "span_" + index} style={{ padding: "0rem 0.4rem" }}>
      <input id={id_prefix + index} key={id_prefix + index} type="radio" name="timeframes" value={tf} onChange={handleTimeframeChanged} />
      <label key={id_prefix + "label_" + index} htmlFor={id_prefix + index}>{tf}</label>
    </span>

  );

  const rolling_ranges = [7, 30, 100, 365];
  const rolling_ranges_radio_buttons = rolling_ranges.map((rr, index) =>

    <span key={"rolling_range_span_" + index} style={{ padding: "0rem 0.4rem" }}>
      <input id={"rolling_range_" + index} key={"rolling_range_" + index} type="radio" name="rolling_ranges" value={rr} onChange={handleRollingRangeChanged} />
      <label key={"rolling_range_label_" + index} htmlFor={"rolling_range_" + index}>{rr}</label>
    </span>
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0rem 1rem" }}>
          <h5>Time Frame</h5>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {timeframes_radio_buttons}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0rem 1rem" }}>
          <h5>Rolling Average Days</h5>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {rolling_ranges_radio_buttons}
          </div>
        </div>
      </div>
      <Chart
        chartType="LineChart"
        data={lineChartData}

        options={{
          //title: "Average Weight by Age",
          height: "500px",
          chartArea: {
            height: "90%"
          },
          hAxis: {
            //title: "Date",
            format: "MMM yy",
            viewWindow: viewWindow,
          },
          vAxis: {
            title: "Km's"
          }
        }}
      //legendToggle
      />
    </>
  );
}

export default ActivitySummaryChart;

