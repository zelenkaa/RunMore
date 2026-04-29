onmessage = async function (e) {
  const runs = e.data;
  let minDate = null;

  if (Array.isArray(runs)) {
    saveRuns(runs);

    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      const runDate = new Date(run.dateTime);
      if (minDate === null || runDate < minDate) {
        minDate = runDate;
      }
    }
  }
  postMessage(minDate);
};

function saveRuns(runs) {
  const request = indexedDB.open("RunMoreDB", 1);

  request.onupgradeneeded = (event) => {
    console.log("Upgrading database...");

    const db = event.target.result;
    if (!db.objectStoreNames.contains("runs")) {
      db.createObjectStore("runs", { keyPath: ["userId", "id"] });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const tx = db.transaction("runs", "readwrite");
    const store = tx.objectStore("runs");

    runs.forEach(item => store.put(item));
    
    tx.onerror = (err) => console.error("Transaction error", err);
  };
}