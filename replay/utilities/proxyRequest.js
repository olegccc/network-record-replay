import StringBuffer from './stringBuffer';

const TcpSocket = chrome.sockets.tcp;

export default class ProxyRequest {

    constructor(socketId, method, url, headers, payload) {
        this._socketId = socketId;
        this._method = method;
        this._url = url;
        this._headers = headers || {};
        this._payload = payload || '';
    }

    getMethod() {
        return this._method;
    }

    getHeader(key) {
        return this._headers[key];
    }

    getPayload() {
        return this._payload;
    }

    getUrl() {
        return this._url;
    }

    _destroySocketById() {
        TcpSocket.disconnect(this._socketId, () => {
            TcpSocket.close(this._socketId);
        });
    }

    _sendRawResponse(rawBody) {
        var buffer = StringBuffer.stringToArrayBuffer(rawBody);
        TcpSocket.send(this._socketId, buffer, () => {
            this._destroySocketById();
        });
    }

    _sendRawResponseAndBody(header, body) {
        TcpSocket.send(this._socketId, StringBuffer.stringToArrayBuffer(header), () => {
            TcpSocket.send(this._socketId, body, () => {
                this._destroySocketById();
            });
        });
    }

    sendResponse(status, statusText, headers, body) {

        let lines = [ 'HTTP/1.0 ' + status + ' ' + statusText ];
        let keys = Object.keys(headers);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i].toLowerCase();
            if (key === 'content-length' || key === 'content-encoding' || key === 'connection' || key === 'transfer-encoding') {
                continue;
            }
            let value = headers[keys[i]];
            lines.push(key + ': ' + value);
        }

        lines.push('content-length: ' + (body ? (body.length || body.byteLength || 0) : 0));

        var textHeader = lines.join('\r\n') + '\r\n\r\n';

        if (body && body.length) {
            textHeader += body;
            body = undefined;
        }

        if (!body) {
            this._sendRawResponse(textHeader);
        } else {
            this._sendRawResponseAndBody(textHeader, body);
        }
    }

    sendStatus(status, statusText) {
        this.sendResponse(status, statusText, { 'content-type': 'text/html' }, '<html><body> ' + statusText + '</body></html>');
    }
}