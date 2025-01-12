"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constTimeEqual = exports.equal = exports.compare = exports.isAllZero = exports.toString = exports.fromString = exports.toBigInt = exports.fromBigInt = exports.fromVarInt = exports.fromUint8 = exports.fromUint64 = exports.fromUint32 = exports.concat = exports.slice = exports.copy = exports.fromHex = exports.toHex = void 0;
const assert = __importStar(require("./assert"));
const types = __importStar(require("./types"));
function toHex(buff) {
    let result = '';
    for (let i = 0; i < buff.length; i++) {
        const value = buff[i].toString(16);
        result += value.length === 1 ? '0' + value : value;
    }
    return result;
}
exports.toHex = toHex;
function fromHex(hexString, expectedLength = 0) {
    if (typeof hexString !== 'string') {
        return new Error('hexString must actually be hex');
    }
    // TODO: check for invalid chars
    const buff = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    if (expectedLength > 0 && buff.length !== expectedLength) {
        return new Error('unexpected length in hex string');
    }
    return buff;
}
exports.fromHex = fromHex;
// returns amount of bytes copied. Does not support partial copies (i.e. target must be big enough)
function copy(buff, target, targetStart = 0, sourceStart = 0, sourceEnd = buff.length) {
    assert.is(buff, Uint8Array);
    assert.is(target, Uint8Array);
    // TODO: this can be optimized with .set
    for (let i = 0; i < sourceEnd - sourceStart; i++) {
        target[i + targetStart] = buff[i + sourceStart];
    }
    return sourceEnd - sourceStart;
}
exports.copy = copy;
function slice(buff, begin = 0, end = buff.length) {
    assert.is(buff, Uint8Array);
    if (begin < 0) {
        begin = Math.max(buff.length + begin, 0);
    }
    return new Uint8Array(buff.buffer, buff.byteOffset + begin, end - begin);
}
exports.slice = slice;
function concat(...buffs) {
    let totalSize = 0;
    for (let i = 0; i < buffs.length; i++) {
        assert.is(buffs[i], Uint8Array);
        totalSize += buffs[i].length;
    }
    const res = new Uint8Array(totalSize);
    let writeAt = 0;
    for (let i = 0; i < buffs.length; i++) {
        res.set(buffs[i], writeAt);
        writeAt += buffs[i].length;
    }
    return res;
}
exports.concat = concat;
function fromUint32(x) {
    assert.check(types.isUint32, x);
    const buff = new ArrayBuffer(4);
    const view = new DataView(buff);
    view.setUint32(0, x);
    return new Uint8Array(buff);
}
exports.fromUint32 = fromUint32;
function fromUint64(x) {
    assert.check(types.isUint64, x);
    const buff = new ArrayBuffer(8);
    const view = new DataView(buff);
    const big = ~~(x / 0x0100000000);
    const low = x % 0x0100000000;
    view.setUint32(0, big);
    view.setUint32(4, low);
    return new Uint8Array(buff);
}
exports.fromUint64 = fromUint64;
function fromUint8(x) {
    assert.check(types.isUint8, x);
    const buff = new Uint8Array(1);
    buff[0] = x;
    return buff;
}
exports.fromUint8 = fromUint8;
function fromVarInt(n) {
    return fromBigInt(BigInt(n));
}
exports.fromVarInt = fromVarInt;
function fromBigInt(n) {
    const out = [];
    const base = BigInt(256);
    while (n >= base) {
        out.push(Number(n % base));
        n = n / base;
    }
    out.push(Number(n));
    const buf = new Uint8Array(out.length);
    buf.set(out.reverse());
    return buf;
}
exports.fromBigInt = fromBigInt;
function toBigInt(bytes) {
    let result = BigInt(0);
    const n = bytes.length;
    // Read input in 8 byte slices
    if (n >= 8) {
        const view = new DataView(bytes.buffer, bytes.byteOffset);
        for (let i = 0, k = n & ~7; i < k; i += 8) {
            const x = view.getBigUint64(i, false);
            result = (result << BigInt(64)) + x;
        }
    }
    // Mop up any remaining bytes
    for (let i = n & ~7; i < n; i++) {
        result = result * BigInt(256) + BigInt(bytes[i]);
    }
    return result;
}
exports.toBigInt = toBigInt;
function fromString(x) {
    assert.check(types.isString, x);
    return new TextEncoder().encode(x);
}
exports.fromString = fromString;
function toString(x) {
    return new TextDecoder().decode(x);
}
exports.toString = toString;
function isAllZero(buff) {
    for (let i = 0; i < buff.length; i++) {
        if (buff[i] !== 0) {
            return false;
        }
    }
    return true;
}
exports.isAllZero = isAllZero;
function compare(a, b) {
    assert.is(a, Uint8Array);
    assert.is(b, Uint8Array);
    const m = Math.min(a.length, b.length);
    for (let i = 0; i < m; i++) {
        const r = a[i] - b[i];
        if (r !== 0) {
            return r;
        }
    }
    if (a.length < b.length) {
        return -1;
    }
    if (b.length < a.length) {
        return 1;
    }
    return 0;
}
exports.compare = compare;
function equal(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.equal = equal;
// only constant time if both arrays are the same length
function constTimeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    let equal = true;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            equal = false; // don't abort early, hopefully the optimizer won't realize it can LOL
        }
    }
    return equal;
}
exports.constTimeEqual = constTimeEqual;
//# sourceMappingURL=buffutils.js.map