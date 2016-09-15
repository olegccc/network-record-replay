import StringBuffer from './stringBuffer';
import ProxyRequest from './proxyRequest';

const TcpServer = chrome.sockets.tcpServer;
const TcpSocket = chrome.sockets.tcp;

export default class ProxyConnection {

    constructor(config = {}) {
        this._config = config;
        this._onReceiveCallback = config.onReceive;
        this._onReceive = this._onReceive.bind(this);
    }

    start(port = 0, address = "127.0.0.1") {

        return new Promise(resolve => {
            TcpServer.create({}, (socketInfo) => {
                this._serverSocketId = socketInfo.socketId;
                TcpServer.listen(this._serverSocketId, address, port, () => {
                    TcpServer.getInfo(this._serverSocketId, (serverInfo) => {
                        this._onServerInitialized(serverInfo.localPort);
                        resolve(serverInfo.localPort);
                    });
                });
            });
        });
    }

    stop() {
        TcpServer.close(this._serverSocketId);
        TcpServer.onAccept.removeListener(ProxyConnection._onAccept);
        TcpSocket.onReceive.removeListener(this._onReceive);

    }

    _onServerInitialized(port) {
        this._port = port;
        TcpServer.onAccept.addListener(ProxyConnection._onAccept);
        TcpSocket.onReceive.addListener(this._onReceive);
        if (this._config.onStart) {
            this._config.onStart();
        }
    }

    static _onAccept(acceptInfo) {
        TcpSocket.setPaused(acceptInfo.clientSocketId, false);
    }

    _onReceive(receiveInfo) {

        var socketId = receiveInfo.socketId;

        var data = StringBuffer.arrayBufferToString(receiveInfo.data);

        var lines = data.replace(/\r/g, '').split('\n');

        if (!lines.length) {
            return;
        }

        var request = lines[0].split(' ');

        if (request.length !== 3) {
            //console.log('wrong http header');
            return;
        }

        var method = request[0];
        var address = request[1];
        var version = request[2];

        if (!version.startsWith('HTTP/')) {
            //console.log('unknown http version');
            return;
        }

        var headers = {};

        var i, key;

        for (i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) {
                i++;
                break;
            }

            var pos = line.indexOf(':');
            if (pos <= 0) {
                continue;
            }

            key = line.substring(0, pos).trim().toLowerCase();

            headers[key] = line.substring(pos+1).trim();
        }

        var payload = '';

        if (i < lines.length) {
            //console.log('has payload');
            payload = lines.slice(i, lines.length).join('\r\n');
        }

        let proxyRequest = new ProxyRequest(socketId, method, address, headers, payload);

        this._onReceiveCallback(proxyRequest);
    }
}
