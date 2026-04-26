onmessage = async function (e) {
    const input = e.data;

    const activities = await (await fetch(`/test_data/activities.json`)).json();

    const activityCount = activities.length;

    postMessage(activityCount);
};
