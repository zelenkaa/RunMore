onmessage = async function (e) {
  const data = e.data;
  const debug = data.debug || false;

  let runDate = new Date(new Date().getFullYear() + 1, 0, 1);

  if (debug === false)
    await fetch('/api/refresh_activities', { method: 'POST' });

  try {
    while (runDate instanceof Date) {
      console.log("Fetching runs for date:", runDate.toISOString());
      const encodedDate = encodeURIComponent(runDate.toISOString());
      const res = await fetch(debug ? '/test_data/runs.json' : `/api/runs/${encodedDate}`);
      const runs = await res.json();

      if (!Array.isArray(runs) || runs.length === 0) break;

      const checkRunResult = await checkRun(runs[runs.length - 1]);
      const saveRunsResult = await saveRuns(runs);

      if (checkRunResult === true)
        break;

      runDate = new Date(runs[runs.length - 1].dateTime);
    }
    postMessage(true);
  } catch (err) {
    postMessage(false);
  }
};

function checkRun(run) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("RunMoreDB", 1);

    request.onupgradeneeded = (event) => {

      const db = event.target.result;
      if (!db.objectStoreNames.contains("runs")) {
        db.createObjectStore("runs", { keyPath: ["userId", "id"] });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("runs", "readonly");
      const store = tx.objectStore("runs");

      const runReq = store.get([run.userId, run.id]);

      tx.oncomplete = () => resolve(runReq.result === undefined ? false : true);
      tx.onerror = (err) => reject(tx.error);
      tx.onabort = (err) => reject(tx.error);
    };
  });
}


function saveRuns(runs) {
  return new Promise((resolve, reject) => {

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

      tx.oncomplete = () => resolve(true);
      tx.onerror = (err) => reject(tx.error);
      tx.onabort = (err) => reject(tx.error);
    };
  });
}