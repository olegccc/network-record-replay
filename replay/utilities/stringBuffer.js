const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function removePaddingChars(input){
    let key = BASE64_ALPHABET.indexOf(input.charAt(input.length - 1));
    if (key == 64){
        return input.substring(0,input.length - 1);
    }
    return input;
}

export default class StringBuffer {
    static arrayBufferToString(buffer) {
        let str = '';
        let uArrayVal = new Uint8Array(buffer);
        for (let s = 0; s < uArrayVal.length; s++) {
            str += String.fromCharCode(uArrayVal[s]);
        }
        return str;
    }

    static stringToUint8Array(string) {
        let buffer = new ArrayBuffer(string.length);
        let view = new Uint8Array(buffer);
        for (let i = 0; i < string.length; i++) {
            view[i] = string.charCodeAt(i);
        }
        return view;
    }

    static stringToArrayBuffer(string) {
        let uintArray = stringToUint8Array(string);
        let buffer = new ArrayBuffer(uintArray.byteLength);
        let view = new Uint8Array(buffer);
        view.set(uintArray, 0);
        return buffer;
    }

    static uint8ToString(u8a){
        const CHUNK_SZ = 0x8000;
        let c = [];
        for (let i=0; i < u8a.length; i+=CHUNK_SZ) {
            c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
        }
        return c.join("");
    }

    static base64ToArrayBuffer(input) {

        input = removePaddingChars(input);
        input = removePaddingChars(input);

        let bytes = parseInt((input.length / 4) * 3, 10);

        let arrayBuffer = new ArrayBuffer(bytes);

        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;

        let uintArray = new Uint8Array(arrayBuffer);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (let i = 0, j = 0; i < bytes; i += 3) {
            enc1 = BASE64_ALPHABET.indexOf(input.charAt(j++));
            enc2 = BASE64_ALPHABET.indexOf(input.charAt(j++));
            enc3 = BASE64_ALPHABET.indexOf(input.charAt(j++));
            enc4 = BASE64_ALPHABET.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uintArray[i] = chr1;

            if (enc3 != 64) {
                uintArray[i+1] = chr2;
            }

            if (enc4 != 64) {
                uintArray[i+2] = chr3;
            }
        }

        return arrayBuffer;
    }
}
