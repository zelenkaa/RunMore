onmessage = async function (e) {
    getRuns();
};


function getRuns() {
    const request = indexedDB.open("RunMoreDB", 1);

    request.onupgradeneeded = (event) => {

        const db = event.target.result;
        if (!db.objectStoreNames.contains("runs")) {
            db.createObjectStore("runs", { keyPath: ["userId", "id"] });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction("runs", "readwrite");
        const store = tx.objectStore("runs");

        const runsReq = store.getAll();

        tx.oncomplete = () => getSummary(runsReq.result);
        tx.onerror = (err) => {
            console.error("Transaction error", err);
            postMessage({ totalRuns: 0, minDate: null, maxDate: null });
        };
    };
}

function getSummary(runs) {
    const totalRuns = runs.length;
    let minDate = null;
    let maxDate = null;
    for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        if (minDate === null || run.dateTime < minDate) {
            minDate = run.dateTime;
        }
        if (maxDate === null || run.dateTime > maxDate) {
            maxDate = run.dateTime;
        }
    }
    postMessage({ totalRuns, minDate, maxDate });
}