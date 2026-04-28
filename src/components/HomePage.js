// App.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function HomePage({ summary }) {

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
    </div>
  );
}
