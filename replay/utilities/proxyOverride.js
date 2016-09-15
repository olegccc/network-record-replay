
const networkRecordExtensionId = 'ihbkogfblhfbnompooimhejpkidoipcl';

const OVERRIDE_ERROR = 'Network Record extension is not installed. Cannot override proxy settings. Please install the extension.';

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
                reject(OVERRIDE_ERROR);
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
                reject(OVERRIDE_ERROR);
            } else {
                resolve();
            }
        });
    });
}
