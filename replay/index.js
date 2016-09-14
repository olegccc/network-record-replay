import './styles/main.css';
import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/index';

import Root from './components/root';

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

const store = createStore(reducers, applyMiddleware(thunk, createLogger()));

render((
    <Provider store={store}>
        <Root/>
    </Provider>
), document.getElementById('app'));

//
// function setStatusText(text) {
//     document.getElementById('status').innerHTML = text;
// }
//
// var networkRecordExtensionId = 'ihbkogfblhfbnompooimhejpkidoipcl';
//
// function onServerInitialized(body, path, localPort) {
//
//     var message = '<p>Serving proxy at 127.0.0.1:' + localPort + '</p>' +
//         '<p>Using file: ' + path + '</p>';
//
//     if (body.pages) {
//         for (var i = 0; i < body.pages.length; i++) {
//             var url = replaceHttpsToHttp(body.pages[i]);
//             message += '<p>Handling page <a href="' + url + '" target="_blank">' + url + '</a></p>';
//         }
//     }
//
//     var requestCount = prepareRequests(body.history);
//
//     if (requestCount > 0) {
//         message += '<p>Parsed ' + requestCount + ' requests</p>';
//     }
//
//     setStatusText(message);
//
//     if (useProxy) {
//         var proxySettings = {
//             mode: 'fixed_servers',
//             rules: {
//                 singleProxy: {
//                     host: '127.0.0.1',
//                     port: localPort
//                 }
//             }
//         };
//
//         chrome.runtime.sendMessage(networkRecordExtensionId, {
//             setProxy: proxySettings
//         });
//     }
//
//     tcpServer.onAccept.addListener(onAccept);
//     tcpSocket.onReceive.addListener(onReceive);
// }
//
// function onFileLoaded(body, path) {
//
//     stop.removeAttribute('disabled');
//     start.setAttribute('disabled', 'disabled');
//     if (proxyCheckbox) {
//         proxyCheckbox.setAttribute('disabled', 'disabled');
//     }
//
//     tcpServer.create({}, function(socketInfo) {
//         serverSocketId = socketInfo.socketId;
//         tcpServer.listen(serverSocketId, "127.0.0.1", 0, function() {
//             tcpServer.getInfo(serverSocketId, function(serverInfo) {
//                 //console.log('listening at ' + serverInfo.localPort);
//                 onServerInitialized(body, path, serverInfo.localPort);
//             });
//         });
//     });
// }
//
// function Uint8ToString(u8a){
//     var CHUNK_SZ = 0x8000;
//     var c = [];
//     for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
//         c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
//     }
//     return c.join("");
// }
//
// function onFileSelected(fileEntry) {
//
//     chrome.fileSystem.getDisplayPath(fileEntry, function(path) {
//         fileEntry.file(function(file) {
//             var reader = new FileReader();
//             reader.onload = function(e) {
//                 var buffer = new Uint8Array(e.target.result);
//                 var body = Uint8ToString(buffer);
//                 body = JSON.parse(body);
//                 onFileLoaded(body, path);
//             };
//             // read as buffer and convert manually to avoid encoding issues
//             reader.readAsArrayBuffer(file);
//         });
//     });
// }
//
// var useProxy = true;
//
// function onStart() {
//
//     if (!proxyCheckbox) {
//         useProxy = false;
//     } else {
//         useProxy = proxyCheckbox.checked;
//     }
//
//     chrome.fileSystem.chooseEntry({
//         type: 'openFile',
//         accepts: [{
//             extensions: ['json']
//         }]
//     }, function(fileEntry) {
//         if (!fileEntry) {
//             return;
//         }
//
//         onFileSelected(fileEntry);
//     });
// }
//
// function onStop() {
//
//     start.removeAttribute('disabled');
//     stop.setAttribute('disabled', 'disabled');
//
//     if (proxyCheckbox) {
//         proxyCheckbox.removeAttribute('disabled');
//     }
//
//     document.getElementById('status').innerHTML = '<p>Stopped</p>';
//
//     if (serverSocketId) {
//         tcpServer.close(serverSocketId);
//         serverSocketId = null;
//
//         if (useProxy) {
//             chrome.runtime.sendMessage(networkRecordExtensionId, {
//                 setProxy: {
//                     mode: 'system'
//                 }
//             });
//         }
//
//         tcpServer.onAccept.removeListener(onAccept);
//         tcpSocket.onReceive.removeListener(onReceive);
//     }
// }
//
// window.onload = function() {
//
//     start = document.getElementById('start');
//     stop = document.getElementById('stop');
//     proxyCheckbox = document.getElementById('proxy');
//
//     chrome.runtime.sendMessage(networkRecordExtensionId, {}, function(response) {
//         if (!response || !response.done) {
//             var holder = document.getElementById('proxy-holder');
//             holder.parentNode.removeChild(holder);
//             proxyCheckbox = null;
//         }
//     });
//
//     stop.setAttribute('disabled', 'disabled');
//
//     start.onclick = onStart;
//     stop.onclick = onStop;
// };
