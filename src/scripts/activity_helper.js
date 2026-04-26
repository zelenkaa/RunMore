
export const activity_helper = {

    get_activities_range_summary: function () {
        return activity_action("get_activities_range_summary");
    },
    fetch_activities: function () {
        return activity_action("fetch_activities");
    },
    insert_activities: function (activities) {
        return activity_action("insert_activities", activities);
    },
    insert_activities_2: function (activities, w) {
        const web_workers = w;
        const activities_chunk = Math.ceil(activities.length / web_workers);

        const promises = [];
        for (let i = 0; i < web_workers; i++) {
            const activities_splice = activities.splice(0, activities_chunk);
            promises.push(activity_action("insert_activities", activities_splice));
        }

        return Promise.all(promises);
    }
};

function activity_action(action, activities) {
    const activities_promise = new Promise(function (activity_resolve, activity_reject) {
        const worker = new Worker(new URL("./activity_web_worker.js", import.meta.url), { type: "module" });
        worker.onmessage = (event) => {
            try {
                const data = event.data;
                if (data.is_successful === 1)
                    activity_resolve(data.result);
                else
                    activity_reject(data.result);
            }
            finally {
                console.log(`terminate`);
                worker.terminate();
            }
        }

        const data = {
            action: action,
            activities: activities
        };
        worker.postMessage(data);
    });

    return activities_promise;
}