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
/*
 * Constants
 */
const FINALIZED = -1;
const DESC = new Uint8Array(16);
const PADDING = new Uint8Array(128);
PADDING[0] = 0x80;
const K = new Uint32Array([
    0x428a2f98,
    0xd728ae22,
    0x71374491,
    0x23ef65cd,
    0xb5c0fbcf,
    0xec4d3b2f,
    0xe9b5dba5,
    0x8189dbbc,
    0x3956c25b,
    0xf348b538,
    0x59f111f1,
    0xb605d019,
    0x923f82a4,
    0xaf194f9b,
    0xab1c5ed5,
    0xda6d8118,
    0xd807aa98,
    0xa3030242,
    0x12835b01,
    0x45706fbe,
    0x243185be,
    0x4ee4b28c,
    0x550c7dc3,
    0xd5ffb4e2,
    0x72be5d74,
    0xf27b896f,
    0x80deb1fe,
    0x3b1696b1,
    0x9bdc06a7,
    0x25c71235,
    0xc19bf174,
    0xcf692694,
    0xe49b69c1,
    0x9ef14ad2,
    0xefbe4786,
    0x384f25e3,
    0x0fc19dc6,
    0x8b8cd5b5,
    0x240ca1cc,
    0x77ac9c65,
    0x2de92c6f,
    0x592b0275,
    0x4a7484aa,
    0x6ea6e483,
    0x5cb0a9dc,
    0xbd41fbd4,
    0x76f988da,
    0x831153b5,
    0x983e5152,
    0xee66dfab,
    0xa831c66d,
    0x2db43210,
    0xb00327c8,
    0x98fb213f,
    0xbf597fc7,
    0xbeef0ee4,
    0xc6e00bf3,
    0x3da88fc2,
    0xd5a79147,
    0x930aa725,
    0x06ca6351,
    0xe003826f,
    0x14292967,
    0x0a0e6e70,
    0x27b70a85,
    0x46d22ffc,
    0x2e1b2138,
    0x5c26c926,
    0x4d2c6dfc,
    0x5ac42aed,
    0x53380d13,
    0x9d95b3df,
    0x650a7354,
    0x8baf63de,
    0x766a0abb,
    0x3c77b2a8,
    0x81c2c92e,
    0x47edaee6,
    0x92722c85,
    0x1482353b,
    0xa2bfe8a1,
    0x4cf10364,
    0xa81a664b,
    0xbc423001,
    0xc24b8b70,
    0xd0f89791,
    0xc76c51a3,
    0x0654be30,
    0xd192e819,
    0xd6ef5218,
    0xd6990624,
    0x5565a910,
    0xf40e3585,
    0x5771202a,
    0x106aa070,
    0x32bbd1b8,
    0x19a4c116,
    0xb8d2d0c8,
    0x1e376c08,
    0x5141ab53,
    0x2748774c,
    0xdf8eeb99,
    0x34b0bcb5,
    0xe19b48a8,
    0x391c0cb3,
    0xc5c95a63,
    0x4ed8aa4a,
    0xe3418acb,
    0x5b9cca4f,
    0x7763e373,
    0x682e6ff3,
    0xd6b2b8a3,
    0x748f82ee,
    0x5defb2fc,
    0x78a5636f,
    0x43172f60,
    0x84c87814,
    0xa1f0ab72,
    0x8cc70208,
    0x1a6439ec,
    0x90befffa,
    0x23631e28,
    0xa4506ceb,
    0xde82bde9,
    0xbef9a3f7,
    0xb2c67915,
    0xc67178f2,
    0xe372532b,
    0xca273ece,
    0xea26619c,
    0xd186b8c7,
    0x21c0c207,
    0xeada7dd6,
    0xcde0eb1e,
    0xf57d4f7f,
    0xee6ed178,
    0x06f067aa,
    0x72176fba,
    0x0a637dc5,
    0xa2c898a6,
    0x113f9804,
    0xbef90dae,
    0x1b710b35,
    0x131c471b,
    0x28db77f5,
    0x23047d84,
    0x32caab7b,
    0x40c72493,
    0x3c9ebe0a,
    0x15c9bebc,
    0x431d67c4,
    0x9c100d4c,
    0x4cc5d4be,
    0xcb3e42b6,
    0x597f299c,
    0xfc657e2a,
    0x5fcb6fab,
    0x3ad6faec,
    0x6c44198c,
    0x4a475817,
]);
class SHA512 {
    state;
    msg;
    block;
    size;
    constructor() {
        this.state = new Uint32Array(16);
        this.msg = new Uint32Array(160);
        this.block = new Uint8Array(128);
        this.size = FINALIZED;
        this.init();
    }
    /**
     * Initialize SHA512 context.
     */
    init() {
        this.state[0] = 0x6a09e667;
        this.state[1] = 0xf3bcc908;
        this.state[2] = 0xbb67ae85;
        this.state[3] = 0x84caa73b;
        this.state[4] = 0x3c6ef372;
        this.state[5] = 0xfe94f82b;
        this.state[6] = 0xa54ff53a;
        this.state[7] = 0x5f1d36f1;
        this.state[8] = 0x510e527f;
        this.state[9] = 0xade682d1;
        this.state[10] = 0x9b05688c;
        this.state[11] = 0x2b3e6c1f;
        this.state[12] = 0x1f83d9ab;
        this.state[13] = 0xfb41bd6b;
        this.state[14] = 0x5be0cd19;
        this.state[15] = 0x137e2179;
        this.size = 0;
        return this;
    }
    update(data) {
        this._update(data, data.length);
        return this;
    }
    final() {
        return this._final(new Uint8Array(64));
    }
    _update(data, len) {
        (0, assert_1.default)(this.size !== FINALIZED);
        let pos = this.size & 0x7f;
        let off = 0;
        this.size += len;
        if (pos > 0) {
            let want = 128 - pos;
            if (want > len)
                want = len;
            buffutils.copy(data, this.block, pos, off, off + want);
            pos += want;
            len -= want;
            off += want;
            if (pos < 128)
                return;
            this.transform(this.block, 0);
        }
        while (len >= 128) {
            this.transform(data, off);
            off += 128;
            len -= 128;
        }
        if (len > 0) {
            buffutils.copy(data, this.block, 0, off, off + len);
        }
    }
    _final(out) {
        (0, assert_1.default)(this.size !== FINALIZED);
        const pos = this.size % 128;
        const len = this.size * 8;
        writeU32(DESC, len * (1 / 0x100000000), 8);
        writeU32(DESC, len, 12);
        this._update(PADDING, 1 + ((239 - pos) % 128));
        this._update(DESC, 16);
        for (let i = 0; i < 16; i++) {
            writeU32(out, this.state[i], i * 4);
            this.state[i] = 0;
        }
        for (let i = 0; i < 160; i++)
            this.msg[i] = 0;
        for (let i = 0; i < 128; i++)
            this.block[i] = 0;
        this.size = FINALIZED;
        return out;
    }
    prepare(chunk, pos) {
        const W = this.msg;
        let i = 0;
        for (; i < 32; i++)
            W[i] = readU32(chunk, pos + i * 4);
        for (; i < 160; i += 2) {
            const c0_hi = g1_512_hi(W[i - 4], W[i - 3]);
            const c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
            const c1_hi = W[i - 14];
            const c1_lo = W[i - 13];
            const c2_hi = g0_512_hi(W[i - 30], W[i - 29]);
            const c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
            const c3_hi = W[i - 32];
            const c3_lo = W[i - 31];
            W[i] = sum64_4_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
            W[i + 1] = sum64_4_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
        }
    }
    transform(chunk, pos) {
        const W = this.msg;
        this.prepare(chunk, pos);
        let ah = this.state[0];
        let al = this.state[1];
        let bh = this.state[2];
        let bl = this.state[3];
        let ch = this.state[4];
        let cl = this.state[5];
        let dh = this.state[6];
        let dl = this.state[7];
        let eh = this.state[8];
        let el = this.state[9];
        let fh = this.state[10];
        let fl = this.state[11];
        let gh = this.state[12];
        let gl = this.state[13];
        let hh = this.state[14];
        let hl = this.state[15];
        for (let i = 0; i < W.length; i += 2) {
            let c0_hi = hh;
            let c0_lo = hl;
            let c1_hi = s1_512_hi(eh, el);
            let c1_lo = s1_512_lo(eh, el);
            const c2_hi = ch64_hi(eh, el, fh, fl, gh);
            const c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
            const c3_hi = K[i];
            const c3_lo = K[i + 1];
            const c4_hi = W[i];
            const c4_lo = W[i + 1];
            const T1_hi = sum64_5_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo);
            const T1_lo = sum64_5_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo);
            c0_hi = s0_512_hi(ah, al);
            c0_lo = s0_512_lo(ah, al);
            c1_hi = maj64_hi(ah, al, bh, bl, ch);
            c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
            const T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
            const T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
            hh = gh;
            hl = gl;
            gh = fh;
            gl = fl;
            fh = eh;
            fl = el;
            eh = sum64_hi(dh, dl, T1_hi, T1_lo);
            el = sum64_lo(dl, dl, T1_hi, T1_lo);
            dh = ch;
            dl = cl;
            ch = bh;
            cl = bl;
            bh = ah;
            bl = al;
            ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
            al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
        }
        sum64(this.state, 0, ah, al);
        sum64(this.state, 2, bh, bl);
        sum64(this.state, 4, ch, cl);
        sum64(this.state, 6, dh, dl);
        sum64(this.state, 8, eh, el);
        sum64(this.state, 10, fh, fl);
        sum64(this.state, 12, gh, gl);
        sum64(this.state, 14, hh, hl);
    }
    static hash() {
        return new SHA512();
    }
    static hmac() {
        return new hmac_1.default(SHA512.hash, 128);
    }
    static digest(...data) {
        const h = new SHA512();
        for (const d of data) {
            h.update(d);
        }
        return h.final();
    }
    static mac(key, data) {
        const m = SHA512.hmac();
        m.init(key);
        m.update(data);
        return m.final();
    }
}
exports.default = SHA512;
/*
 * Helpers
 */
function sum64(buf, pos, ah, al) {
    const bh = buf[pos];
    const bl = buf[pos + 1];
    const lo = (al + bl) >>> 0;
    const hi = (lo < al ? 1 : 0) + ah + bh;
    buf[pos] = hi >>> 0;
    buf[pos + 1] = lo;
}
function sum64_hi(ah, al, bh, bl) {
    const lo = (al + bl) >>> 0;
    const hi = (lo < al ? 1 : 0) + ah + bh;
    return hi >>> 0;
}
function sum64_lo(ah, al, bh, bl) {
    const lo = al + bl;
    return lo >>> 0;
}
function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
    let carry = 0;
    let lo = al;
    lo = (lo + bl) >>> 0;
    carry += lo < al ? 1 : 0;
    lo = (lo + cl) >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = (lo + dl) >>> 0;
    carry += lo < dl ? 1 : 0;
    const hi = ah + bh + ch + dh + carry;
    return hi >>> 0;
}
function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
    const lo = al + bl + cl + dl;
    return lo >>> 0;
}
function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    let carry = 0;
    let lo = al;
    lo = (lo + bl) >>> 0;
    carry += lo < al ? 1 : 0;
    lo = (lo + cl) >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = (lo + dl) >>> 0;
    carry += lo < dl ? 1 : 0;
    lo = (lo + el) >>> 0;
    carry += lo < el ? 1 : 0;
    const hi = ah + bh + ch + dh + eh + carry;
    return hi >>> 0;
}
function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    const lo = al + bl + cl + dl + el;
    return lo >>> 0;
}
function rotr64_hi(ah, al, num) {
    const r = (al << (32 - num)) | (ah >>> num);
    return r >>> 0;
}
function rotr64_lo(ah, al, num) {
    const r = (ah << (32 - num)) | (al >>> num);
    return r >>> 0;
}
function shr64_hi(ah, al, num) {
    return ah >>> num;
}
function shr64_lo(ah, al, num) {
    const r = (ah << (32 - num)) | (al >>> num);
    return r >>> 0;
}
function ch64_hi(xh, xl, yh, yl, zh) {
    let r = (xh & yh) ^ (~xh & zh);
    if (r < 0)
        r += 0x100000000;
    return r;
}
function ch64_lo(xh, xl, yh, yl, zh, zl) {
    let r = (xl & yl) ^ (~xl & zl);
    if (r < 0)
        r += 0x100000000;
    return r;
}
function maj64_hi(xh, xl, yh, yl, zh) {
    let r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
    if (r < 0)
        r += 0x100000000;
    return r;
}
function maj64_lo(xh, xl, yh, yl, zh, zl) {
    let r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
    if (r < 0)
        r += 0x100000000;
    return r;
}
function s0_512_hi(xh, xl) {
    const c0_hi = rotr64_hi(xh, xl, 28);
    const c1_hi = rotr64_hi(xl, xh, 2); // 34
    const c2_hi = rotr64_hi(xl, xh, 7); // 39
    let r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function s0_512_lo(xh, xl) {
    const c0_lo = rotr64_lo(xh, xl, 28);
    const c1_lo = rotr64_lo(xl, xh, 2); // 34
    const c2_lo = rotr64_lo(xl, xh, 7); // 39
    let r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function s1_512_hi(xh, xl) {
    const c0_hi = rotr64_hi(xh, xl, 14);
    const c1_hi = rotr64_hi(xh, xl, 18);
    const c2_hi = rotr64_hi(xl, xh, 9); // 41
    let r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function s1_512_lo(xh, xl) {
    const c0_lo = rotr64_lo(xh, xl, 14);
    const c1_lo = rotr64_lo(xh, xl, 18);
    const c2_lo = rotr64_lo(xl, xh, 9); // 41
    let r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function g0_512_hi(xh, xl) {
    const c0_hi = rotr64_hi(xh, xl, 1);
    const c1_hi = rotr64_hi(xh, xl, 8);
    const c2_hi = shr64_hi(xh, xl, 7);
    let r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function g0_512_lo(xh, xl) {
    const c0_lo = rotr64_lo(xh, xl, 1);
    const c1_lo = rotr64_lo(xh, xl, 8);
    const c2_lo = shr64_lo(xh, xl, 7);
    let r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function g1_512_hi(xh, xl) {
    const c0_hi = rotr64_hi(xh, xl, 19);
    const c1_hi = rotr64_hi(xl, xh, 29); // 61
    const c2_hi = shr64_hi(xh, xl, 6);
    let r = c0_hi ^ c1_hi ^ c2_hi;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function g1_512_lo(xh, xl) {
    const c0_lo = rotr64_lo(xh, xl, 19);
    const c1_lo = rotr64_lo(xl, xh, 29); // 61
    const c2_lo = shr64_lo(xh, xl, 6);
    let r = c0_lo ^ c1_lo ^ c2_lo;
    if (r < 0)
        r += 0x100000000;
    return r;
}
function writeU32(buf, value, offset) {
    buf[offset] = value >>> 24;
    buf[offset + 1] = (value >> 16) & 0xff;
    buf[offset + 2] = (value >> 8) & 0xff;
    buf[offset + 3] = value & 0xff;
}
function readU32(buf, offset) {
    return ((buf[offset] & 0xff) * 0x1000000 +
        (((buf[offset + 1] & 0xff) << 16) | ((buf[offset + 2] & 0xff) << 8) | (buf[offset + 3] & 0xff)));
}
//# sourceMappingURL=sha512.js.map