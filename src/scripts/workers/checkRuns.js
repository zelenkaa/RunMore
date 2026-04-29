onmessage = async function (e) {
    const runs = e.data;

    if (Array.isArray(runs)) {
        const run = runs[runs.length - 1];
        if (run && run.userId && run.id) {
            checkRun(run);
        }
    }
};


function checkRun(run) {
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

        tx.oncomplete = () => {
            if (runReq.result) {
                postMessage({ exists: true });
            } else {
                postMessage({ exists: false });
            }
        };
        tx.onerror = (err) => {
            console.error("Transaction error", err);
            postMessage({ exists: "error" });
        };
    };
}