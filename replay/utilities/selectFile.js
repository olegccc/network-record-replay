export default function openFile(extension) {

    let config = {
        type: 'openFile'
    };

    if (extension) {
        config.accepts = [{
            extensions: [extension]
        }];
    }

    return new Promise((resolve, reject) => {
        chrome.fileSystem.chooseEntry(config, (fileEntry) => {

            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            }

            if (!fileEntry) {
                reject();
                return;
            }

            chrome.fileSystem.getDisplayPath(fileEntry, (path) => {

                fileEntry.file((file) => {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        resolve(e.target.result, path);
                    };
                    reader.readAsArrayBuffer(file);
                });
            });
        });
    });
}