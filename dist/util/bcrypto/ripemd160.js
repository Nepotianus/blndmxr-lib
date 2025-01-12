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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("../assert"));
const buffutils = __importStar(require("../buffutils"));
const hmac_1 = __importDefault(require("./hmac"));
const FINALIZED = -1;
const DESC = new Uint8Array(8);
const PADDING = new Uint8Array(64);
PADDING[0] = 0x80;
const r = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8,
    3,
    10,
    14,
    4,
    9,
    15,
    8,
    1,
    2,
    7,
    0,
    6,
    13,
    11,
    5,
    12,
    1,
    9,
    11,
    10,
    0,
    8,
    12,
    4,
    13,
    3,
    7,
    15,
    14,
    5,
    6,
    2,
    4,
    0,
    5,
    9,
    7,
    12,
    2,
    10,
    14,
    1,
    3,
    8,
    11,
    6,
    15,
    13,
];
const rh = [
    5,
    14,
    7,
    0,
    9,
    2,
    11,
    4,
    13,
    6,
    15,
    8,
    1,
    10,
    3,
    12,
    6,
    11,
    3,
    7,
    0,
    13,
    5,
    10,
    14,
    15,
    8,
    12,
    4,
    9,
    1,
    2,
    15,
    5,
    1,
    3,
    7,
    14,
    6,
    9,
    11,
    8,
    12,
    2,
    10,
    0,
    4,
    13,
    8,
    6,
    4,
    1,
    3,
    11,
    15,
    0,
    5,
    12,
    2,
    13,
    9,
    7,
    10,
    14,
    12,
    15,
    10,
    4,
    1,
    5,
    8,
    7,
    6,
    2,
    13,
    14,
    0,
    3,
    9,
    11,
];
const s = [
    11,
    14,
    15,
    12,
    5,
    8,
    7,
    9,
    11,
    13,
    14,
    15,
    6,
    7,
    9,
    8,
    7,
    6,
    8,
    13,
    11,
    9,
    7,
    15,
    7,
    12,
    15,
    9,
    11,
    7,
    13,
    12,
    11,
    13,
    6,
    7,
    14,
    9,
    13,
    15,
    14,
    8,
    13,
    6,
    5,
    12,
    7,
    5,
    11,
    12,
    14,
    15,
    14,
    15,
    9,
    8,
    9,
    14,
    5,
    6,
    8,
    6,
    5,
    12,
    9,
    15,
    5,
    11,
    6,
    8,
    13,
    12,
    5,
    12,
    13,
    14,
    11,
    8,
    5,
    6,
];
const sh = [
    8,
    9,
    9,
    11,
    13,
    15,
    15,
    5,
    7,
    7,
    8,
    11,
    14,
    14,
    12,
    6,
    9,
    13,
    15,
    7,
    12,
    8,
    9,
    11,
    7,
    7,
    12,
    7,
    6,
    15,
    13,
    11,
    9,
    7,
    15,
    11,
    8,
    6,
    6,
    14,
    12,
    13,
    5,
    14,
    13,
    13,
    7,
    5,
    15,
    5,
    8,
    11,
    14,
    14,
    6,
    14,
    6,
    9,
    12,
    9,
    12,
    5,
    15,
    8,
    8,
    5,
    12,
    9,
    12,
    5,
    14,
    6,
    8,
    13,
    6,
    5,
    15,
    13,
    11,
    11,
];
class RIPEMD160 {
    state;
    msg;
    block;
    size;
    constructor() {
        this.state = new Uint32Array(5);
        this.msg = new Uint32Array(16);
        this.block = Buffer.allocUnsafe(64);
        this.size = FINALIZED;
        this.init();
    }
    init() {
        this.state[0] = 0x67452301;
        this.state[1] = 0xefcdab89;
        this.state[2] = 0x98badcfe;
        this.state[3] = 0x10325476;
        this.state[4] = 0xc3d2e1f0;
        this.size = 0;
        return this;
    }
    update(data) {
        this._update(data, data.length);
        return this;
    }
    final() {
        return this._final(new Uint8Array(20));
    }
    _update(data, len) {
        (0, assert_1.default)(this.size !== FINALIZED);
        let pos = this.size & 0x3f;
        let off = 0;
        this.size += len;
        if (pos > 0) {
            let want = 64 - pos;
            if (want > len)
                want = len;
            buffutils.copy(data, this.block, pos, off, off + want);
            pos += want;
            len -= want;
            off += want;
            if (pos < 64)
                return;
            this.transform(this.block, 0);
        }
        while (len >= 64) {
            this.transform(data, off);
            off += 64;
            len -= 64;
        }
        if (len > 0) {
            buffutils.copy(data, this.block, 0, off, off + len);
        }
    }
    /**
     * Finalize RIPEMD160 context.
     * @private
     * @param {Buffer} out
     * @returns {Buffer}
     */
    _final(out) {
        (0, assert_1.default)(this.size !== FINALIZED);
        const pos = this.size % 64;
        const len = this.size * 8;
        writeU32(DESC, len, 0);
        writeU32(DESC, len * (1 / 0x100000000), 4);
        this._update(PADDING, 1 + ((119 - pos) % 64));
        this._update(DESC, 8);
        for (let i = 0; i < 5; i++) {
            writeU32(out, this.state[i], i * 4);
            this.state[i] = 0;
        }
        for (let i = 0; i < 16; i++)
            this.msg[i] = 0;
        for (let i = 0; i < 64; i++)
            this.block[i] = 0;
        this.size = FINALIZED;
        return out;
    }
    transform(chunk, pos) {
        const W = this.msg;
        let A = this.state[0];
        let B = this.state[1];
        let C = this.state[2];
        let D = this.state[3];
        let E = this.state[4];
        let Ah = A;
        let Bh = B;
        let Ch = C;
        let Dh = D;
        let Eh = E;
        for (let i = 0; i < 16; i++)
            W[i] = readU32(chunk, pos + i * 4);
        for (let j = 0; j < 80; j++) {
            let a = A + f(j, B, C, D) + W[r[j]] + K(j);
            let b = rotl32(a, s[j]);
            let T = b + E;
            A = E;
            E = D;
            D = rotl32(C, 10);
            C = B;
            B = T;
            a = Ah + f(79 - j, Bh, Ch, Dh) + W[rh[j]] + Kh(j);
            b = rotl32(a, sh[j]);
            T = b + Eh;
            Ah = Eh;
            Eh = Dh;
            Dh = rotl32(Ch, 10);
            Ch = Bh;
            Bh = T;
        }
        const T = this.state[1] + C + Dh;
        this.state[1] = this.state[2] + D + Eh;
        this.state[2] = this.state[3] + E + Ah;
        this.state[3] = this.state[4] + A + Bh;
        this.state[4] = this.state[0] + B + Ch;
        this.state[0] = T;
    }
    static hash() {
        return new RIPEMD160();
    }
    static hmac() {
        return new hmac_1.default(RIPEMD160.hash, 64);
    }
    static digest(...data) {
        const h = new RIPEMD160();
        for (const d of data) {
            h.update(d);
        }
        return h.final();
    }
    static mac(key, data) {
        const m = RIPEMD160.hmac();
        m.init(key);
        m.update(data);
        return m.final();
    }
}
exports.default = RIPEMD160;
/*
 * Helpers
 */
function rotl32(w, b) {
    return (w << b) | (w >>> (32 - b));
}
function f(j, x, y, z) {
    if (j <= 15)
        return x ^ y ^ z;
    if (j <= 31)
        return (x & y) | (~x & z);
    if (j <= 47)
        return (x | ~y) ^ z;
    if (j <= 63)
        return (x & z) | (y & ~z);
    return x ^ (y | ~z);
}
function K(j) {
    if (j <= 15)
        return 0x00000000;
    if (j <= 31)
        return 0x5a827999;
    if (j <= 47)
        return 0x6ed9eba1;
    if (j <= 63)
        return 0x8f1bbcdc;
    return 0xa953fd4e;
}
function Kh(j) {
    if (j <= 15)
        return 0x50a28be6;
    if (j <= 31)
        return 0x5c4dd124;
    if (j <= 47)
        return 0x6d703ef3;
    if (j <= 63)
        return 0x7a6d76e9;
    return 0x00000000;
}
function writeU32(buf, value, offset) {
    buf[offset + 3] = value >>> 24;
    buf[offset + 2] = (value >> 16) & 0xff;
    buf[offset + 1] = (value >> 8) & 0xff;
    buf[offset] = value & 0xff;
}
function readU32(buf, offset) {
    return ((buf[offset + 3] & 0xff) * 0x1000000 +
        (((buf[offset + 2] & 0xff) << 16) | ((buf[offset + 1] & 0xff) << 8) | (buf[offset] & 0xff)));
}
//# sourceMappingURL=ripemd160.js.map