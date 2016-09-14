var isRecordingPhase = false;
var isProxySet = false;
var iconIndex = 0;

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {

    if (request.resetProxy) {
        chrome.proxy.settings.clear({ scope: 'regular' });
        isProxySet = false;
        updateIcon();
    } else if (request.setProxy) {
        chrome.proxy.settings.set({ value: request.setProxy, scope: 'regular' });
        isProxySet = true;
        updateIcon();
    }

    sendResponse({done: true});
});

function updateIcon() {

    var iconName;

    if (isRecordingPhase) {
        iconName = 'record' + ((iconIndex % 2)+1) + '.png';
    } else {
        iconName = isProxySet ? 'proxy.png' : 'record.png';
    }

    chrome.browserAction.setIcon({path: iconName});
}

var interval;

var currentTab;
var version = "1.0";

var requests = [];
var requestsMap = {};
var pages = {};

function stopRecording() {
    clearInterval(interval);

    if (currentTab) {
        chrome.debugger.detach({
            tabId: currentTab.id
        });
        currentTab = null;
    }

    requestsMap = {};

    var body = JSON.stringify({
        history: requests,
        pages: Object.keys(pages)
    }, null, " ");

    requests = [];
    pages = {};

    var url = URL.createObjectURL(new Blob([body], { type: 'application/json'}));

    chrome.downloads.download({
        url: url,
        filename: 'history.json',
        saveAs: true
    });
}

function showAlert(string) {
    chrome.notifications.create("", {
        type: 'basic',
        title: 'Alert',
        iconUrl: 'icon1.png',
        message: string.length ? string : JSON.stringify(string)
    });
}

function onAttach(tabId) {

    if (chrome.runtime.lastError) {
        isRecordingPhase = false;
        updateIcon();

        showAlert(chrome.runtime.lastError.message);

        return;
    }

    isRecordingPhase = true;

    interval = setInterval(function() {
        iconIndex++;
        updateIcon();
    }, 500);

    updateIcon();

    chrome.debugger.sendCommand({
        tabId: tabId
    }, "Network.enable");

    chrome.debugger.onEvent.addListener(allEventHandler);
    chrome.debugger.onDetach.addListener(onDebuggerDetached);
}

function onDebuggerDetached() {
    currentTab = null;
    stopRecording();
    isRecordingPhase = false;
    updateIcon();
}

function allEventHandler(debuggeeId, message, params) {

    if (currentTab.id != debuggeeId.tabId) {
        return;
    }

    if (!params.requestId) {
        return;
    }

    var request = requestsMap[params.requestId];

    if (!request) {
        request = {
            created: new Date().toISOString()
        };
        requestsMap[params.requestId] = request;
        requests.push(request);
    }

    //console.log('debug:', message, params);

    switch (message) {
        case "Network.responseReceived":
            request.received = new Date().toISOString();
            request.response = {
                headers: params.response.headers,
                remoteIpAddress: params.response.remoteIPAddress,
                status: params.response.status,
                statusText: params.response.statusText
            };
            break;
        case "Network.requestWillBeSent":
            if (params.redirectResponse && request.request) {

                var location = params.redirectResponse.headers['Location'] || params.redirectResponse.headers['location'];

                if (location && request.request.url.endsWith(location)) {
                    break;
                }

                request.response = {
                    headers: params.redirectResponse.headers,
                    remoteIpAddress: params.redirectResponse.remoteIPAddress,
                    status: params.redirectResponse.status,
                    statusText: params.redirectResponse.statusText,
                    body: {
                        base64Encoded: false,
                        body: params.redirectResponse.statusText
                    }
                };

                request = {
                    created: new Date().toISOString()
                };
                requests.push(request);
                requestsMap[params.requestId] = request;
            }
            request.request = params.request;
            request.initiator = params.initiator;
            request.documentUrl = params.documentURL;
            if (request.documentUrl) {
                pages[request.documentUrl] = true;
            }
            break;
        case "Network.dataReceived":
            break;
        case "Network.loadingFinished":

            chrome.debugger.sendCommand({
                tabId: debuggeeId.tabId
            }, "Network.getResponseBody", {
                "requestId": params.requestId
            }, function(response) {
                if (response) {
                    request.response.body = response;
                }
            });
            break;
    }
}

function startRecording() {

    requests = [];
    requestsMap = {};
    pages = {};

    chrome.tabs.query({
            currentWindow: true,
            active: true
    }, function(tabArray) {
        currentTab = tabArray[0];
        chrome.debugger.attach({
            tabId: currentTab.id
        }, version, onAttach.bind(null, currentTab.id));
    });
}

function onActionClicked() {
    if (isRecordingPhase) {
        stopRecording();
        isRecordingPhase = false;
        updateIcon();
    } else {
        startRecording();
    }
}

chrome.browserAction.onClicked.addListener(onActionClicked);

updateIcon();
