const API = {
    organizationList: "/orgsList",
    analytics: "/api3/analitics", // измененный адрес
    orgReqs: "/api3/reqBase",
    buhForms: "/api3/buh",
};

async function run() {
    try {
        const orgOgrns = await sendRequest(API.organizationList);
        if (!orgOgrns) return;

        const ogrns = orgOgrns.join(",");
        const [requisites, analyticsData, buhData] = await Promise.all([
            sendRequest(`${API.orgReqs}?ogrn=${ogrns}`),
            sendRequest(`${API.analytics}?ogrn=${ogrns}`),
            sendRequest(`${API.buhForms}?ogrn=${ogrns}`)
        ]);

        if (!requisites) return;
        const orgsMap = reqsToMap(requisites);

        if (analyticsData) addInOrgsMap(orgsMap, analyticsData, "analytics");
        if (buhData) addInOrgsMap(orgsMap, buhData, "buhForms");

        render(orgsMap, orgOgrns);
    } catch (error) {
        console.error("Unhandled error:", error);
    }
}

async function sendRequest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert(`Error ${response.status}: ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        alert(`Request failed: ${error.message}`);
        return null;
    }
}

function reqsToMap(requisites) {
    return requisites.reduce((acc, item) => {
        acc[item.ogrn] = item;
        return acc;
    }, {});
}

function addInOrgsMap(orgsMap, additionalInfo, key) {
    if (!additionalInfo) return;
    for (const item of additionalInfo) {
        if (orgsMap[item.ogrn]) {
            orgsMap[item.ogrn][key] = item[key];
        }
    }
}
