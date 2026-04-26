import React, { useState } from 'react';
import ActivitySummaryChart from "./components/ActivitySummaryChart";
import { activity_helper } from "./scripts/activity_helper.js";

function App() {
  const [data, setData] = useState('X');
  const [lineChartData, setLineChartDate] = useState([['Date', 'Distance', 'Speed', 'Top'], [new Date(2025, 11, 25), 12.1, 11.7, 13.3]]);
  const [rangeSummaryData, setRangeSummaryData] = useState([{ range: 7, date_summaries: [] }]);
  const [viewWindow, setViewWindow] = useState({
    min: new Date(2024, 11, 25),
    max: new Date(2025, 11, 25)
  });

  const strava_athorization = "http://www.strava.com/oauth/authorize?client_id=76091&response_type=code&redirect_uri=" + window.location.origin + "/api/strava_authorization&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all";



  async function handleStravaGetAllActivities() {

    try {
      const text = await (await fetch(`/api/strava_get_all_activities`)).text();
      setData(text);
    }
    catch (ex) {
      setData(ex);
    }
  }

  async function handleLoadChart() {

    try {
      const activities_range_summary = await activity_helper.get_activities_range_summary();

      console.log(activities_range_summary);
      setRangeSummaryData(activities_range_summary);

      if (rangeSummaryData !== null && rangeSummaryData.length > 0)
        setLineChartDate(activities_range_summary[0].date_summaries);
    }
    catch (ex) {
      console.log(`catch: ${ex}`);
    }
  }


  async function handleTest() {
    try {
      //const activities = await (await fetch(`/api/activities`)).json();
      //const activities = await (await fetch(`/test_data/activities.json`)).json();

      const now = Date.now();
      await activity_helper.fetch_activities();
      console.log(`TIME: ${(Date.now() - now) / 1000}`);
    }
    catch (ex) {
      console.log(`catch: ${ex}`);
    }
  }

  /*
  async function handleTest() {

    for (let w = 1; w < 16; w++) {
      let total_time = 0;
      for (let i = 0; i < 2; i++) {
        try {
          //const activities = await (await fetch(`/api/activities`)).json();
          const activities = await (await fetch(`/test_data/activities.json`)).json();
          const now = Date.now();
          await activity_helper.insert_activities_2(activities, w);
          total_time += Date.now() - now;
        }
        catch (ex) {
          console.log(`catch: ${ex}`);
        }
      }
      console.log(`Threads: ${String(w).padStart(2, '0')}\tTIME: ${total_time / 1000}`);
    }
  }
    */


  function handleRollingRangeChanged(event) {

    const rolling_range = event.target.value;

    console.log(`rolling_range: ${rolling_range}`);


    let rolling_range_index = 0;

    for (let r = 0; r < rangeSummaryData.length; r++) {
      const range_summary = rangeSummaryData[r];
      console.log(`range_summary.range: ${range_summary.range}`);

      if (range_summary.range == rolling_range) {
        rolling_range_index = r;
        break;
      }
    }
    console.log(`rolling_range_index: ${rolling_range_index}`);

    setLineChartDate(rangeSummaryData[rolling_range_index].date_summaries);

  }
  function handleTimeframeChanged(event) {

    const timeframe = event.target.value;
    const number_months = timeframe === 'Month' ? 1 : timeframe === '3 Months' ? 3 : 12;
    console.log(`timeframe: ${timeframe}`);

    const data = rangeSummaryData;

    if (data !== null && Array.isArray(data) && data.length > 0 && Array.isArray(data[0].date_summaries) && data[0].date_summaries.length > 1) {
      const end_date = new Date(data[0].date_summaries[1][0]);
      const start_date = new Date(end_date);
      start_date.setMonth(start_date.getMonth() - number_months);


      setViewWindow({
        min: start_date,
        max: end_date
      });

      console.log(`end_date: ${end_date}`);
      console.log(`start_date: ${start_date}`);
    }
  }

  return <>
    <div className='App'>
      {/*       
      <Navbar />
      <Home /> */}

      <table>
        <tbody>
          <tr>
            <td><a href={strava_athorization}>Strava Authorization</a></td>
          </tr>
          <tr>
            <td><button onClick={handleStravaGetAllActivities}>Strava Get All Activities</button></td>
          </tr>
          <tr>
            <td><button onClick={handleLoadChart}>Load Chart</button></td>
          </tr>
          <tr>
            <td><button onClick={handleTest}>TEST</button></td>
          </tr>
          <tr>
            <th colSpan="2">Results</th>
          </tr>
          <tr>
            <td colSpan="2">{data}</td>
          </tr>
        </tbody>
      </table>

      <ActivitySummaryChart
        lineChartData={lineChartData}
        handleRollingRangeChanged={handleRollingRangeChanged}
        handleTimeframeChanged={handleTimeframeChanged}
        viewWindow={viewWindow} />
    </div>
  </>;
}

export default App;
