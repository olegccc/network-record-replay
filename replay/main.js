chrome.app.runtime.onLaunched.addListener(function(intentData) {
    chrome.app.window.create('index.html', {
        id: "mainwin",
        innerBounds: {
            width: 500,
            height: 640
        }
    });
});