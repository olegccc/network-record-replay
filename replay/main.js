chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: "mainwin",
        innerBounds: {
            width: 500,
            height: 640
        }
    }, function(createdWindow) {
        createdWindow.onClosed.addListener(function() {
            chrome.runtime.sendMessage(networkRecordExtensionId, {
                resetProxy: true
            });
        });
    });
});

const networkRecordExtensionId = 'ihbkogfblhfbnompooimhejpkidoipcl';
