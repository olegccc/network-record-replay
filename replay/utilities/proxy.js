import StringBuffer from './stringBuffer';
import ProxyConnection from './proxyConnection';

const CONTENT_TYPES = {
    css: 'text/css',
    js: 'text/javascript',
    html: 'text/html'
};

export default class Proxy {

    constructor(config) {
        this._config = config;
        this._urls = {};
        this._processRecords(config.history);
    }

    start() {
        this._connection = new ProxyConnection({
            onReceive: this._onReceive.bind(this)
        });
        return this._connection.start();
    }

    stop() {
        this._connection.stop();
        this._connection = null;
    }

    replaceOverride(override) {
        this._config.override = override;
    }

    getUrls() {
        return Object.keys(this._urls);
    }

    static _cleanPayload(text) {
        return text.replace(/\r|\n/g, '').replace(/https/gi, 'http');
    }

    _handlePayload(key) {
        return this._config.handlePayload && this._config.handlePayload[key];
    }

    _replaceHttps(text) {
        if (this._config.replaceHttps) {
            return text.replace(/https:\/\//gi, "http://").replace(/"https"/gi, '"http"');
        }
        return text;
    }

    _onReceive(request) {

        let key = request.getMethod() + ';' + request.getUrl();

        if (this._handlePayload(key)) {
            key += ';' + Proxy._cleanPayload(request.getPayload());
        }

        let record = this._records[key];

        if (!record) {
            request.sendStatus(404, 'Not found');
            return;
        }

        let index = record.index;

        record.index++;

        if (record.index >= record.items.length) {
            record.index = 0;
        }

        record = record.items[index];

        let file = null;

        if (this._config.override) {
            let override = this._config.override.get('ALL:' + request.getUrl());

            if (!override) {
                override = this._config.override.get(request.getMethod() + ':' + request.getUrl());
            }

            if (override) {
                file = override.get('file');
            }
        }

        request.sendResponse(record.status, record.statusText, record.headers, file ? file : record.body);
    }

    _processRecord(record) {

        if (!record.response || !record.request) {
            return 0;
        }

        let headers = {};

        if (record.response.headers) {
            let keys = Object.keys(record.response.headers);
            keys.forEach(key => {
                headers[key.toLowerCase()] = record.response.headers[key];
            });
        }

        if (headers.location) {
            headers.location = this._replaceHttps(headers.location);
        }

        record.response.headers = headers;

        let contentType = headers['content-type'] || '';

        let url = this._replaceHttps(record.request.url);

        this._urls[url] = true;

        let key = record.request.method + ';' + url;

        if (this._handlePayload(key)) {
            key += ';' + Proxy._cleanPayload(record.request.postData);
        }

        let request = this._records[key];

        let requestCount = 0;

        if (!request) {
            request = {
                items: [],
                index: 0
            };
            this._records[key] = request;
            requestCount++;
        }

        if (!contentType) {
            let lastDot = record.request.url.lastIndexOf('.');
            if (lastDot > 0) {
                let extension = record.request.url.substring(lastDot+1).toLowerCase();
                contentType = CONTENT_TYPES[extension];
            }
            if (contentType) {
                record.response.headers['content-type'] = contentType;
            }
        }

        let body;

        if (record.response.body) {
            if (record.response.body.base64Encoded) {
                body = StringBuffer.base64ToArrayBuffer(record.response.body.body);
            } else {
                if (record.response.status === 304) {
                    record.response.status = 200;
                    record.response.statusText = 'OK';
                }
                if (record.response.status !== 200) {
                    body = record.response.body.body;
                } else {
                    body = StringBuffer.stringToArrayBuffer(this._replaceHttps(record.response.body.body));
                }
            }
        }

        request.items.push({
            headers: record.response.headers,
            status: record.response.status,
            statusText: record.response.statusText || 'OK',
            body: body
        });

        return requestCount;
    }

    _processRecords(records) {

        this._records = {};

        let requestCount = 0;

        records.forEach(record => {
            requestCount += this._processRecord(record);
        });

        return requestCount;
    }
}
