
const networkRecordExtensionId = 'ihbkogfblhfbnompooimhejpkidoipcl';

export function setOverride(portNumber) {

    const proxySettings = {
        mode: 'fixed_servers',
        rules: {
            singleProxy: {
                host: '127.0.0.1',
                port: portNumber
            }
        }
    };

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(networkRecordExtensionId, {
            setProxy: proxySettings
        }, response => {
            if (!response || !response.done) {
                reject();
            } else {
                resolve();
            }
        });
    });
}

export function clearOverride() {

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(networkRecordExtensionId, {
            resetProxy: true
        }, response => {
            if (!response || !response.done) {
                reject('Network Record extension is not installed. Cannot override proxy settings. Please install the extension.');
            } else {
                resolve();
            }
        });
    });
}
